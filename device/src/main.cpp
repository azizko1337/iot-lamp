//arduino framework
#include <Arduino.h>

//servo
#include <Servo.h>

//temperature
#include <OneWire.h>
#include <DallasTemperature.h>

//wifi and socketio connection
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266WebServer.h>
#include <DNSServer.h>
#include <WiFiManager.h>
#include <WebSocketsClient.h>
#include <SocketIOclient.h>

//eeprom to store lamp code
#include <EEPROM.h>

//json to socketio communication
#include <ArduinoJson.h>
#include <Hash.h>

#define USE_SERIAL Serial

//lamp configs
const String server = "srv23.mikr.us"; //"192.168.0.104";
const int port = 20374;
char lampCode[38] = "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"; //uuid4;
bool didShaked = false;
struct {
    int brightness = A0;
    int temperature = D1;
    int motion = D2;
    int angle = D3;
    int power = D4;
    int led = D5;
    int button = D6;
} PINS;
struct {
    int brightness = 0; //0-1023
    float temperature = 0;
    bool motion = false; 
    int angle = 90; //0-180
    int power = 0; //0-255
    int led = 1;
    int button = 0;
} state;
struct {
    int brightness = 0; //0-1023
    float temperature = 0;
    bool motion = false; 
    int button = 0;
} oldState;

WiFiManager wifiManager;
SocketIOclient socketIO;

OneWire oneWire(PINS.temperature);
DallasTemperature temperatureSensors(&oneWire);

Servo servo;

void readSensors();
void updateOutputs();
void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length);
void emit(String event, float value);
void emit(String event, String value);
void eventHandler(uint8_t * payload);

void setup() {
    //brightness sensor
    pinMode(PINS.brightness, INPUT);
    //temperature sensor ds18b20
    temperatureSensors.begin();
    pinMode(PINS.motion, INPUT);
    //servo pin
    servo.attach(PINS.angle);
    //power pin
    pinMode(PINS.power, OUTPUT);
    //led output
    pinMode(PINS.led, OUTPUT);
    //button input
    pinMode(PINS.button, INPUT_PULLUP);

    //start the lamp as off with led on
    updateOutputs();

    USE_SERIAL.begin(115200);
    USE_SERIAL.setDebugOutput(true);
    USE_SERIAL.println();
    USE_SERIAL.println();
    USE_SERIAL.println();
    // for(uint8_t t = 4; t > 0; t--) {
    //     USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
    //     USE_SERIAL.flush();
    //     delay(1000);
    // }

    
    //connect to wifi and save/load lampCode
    wifiManager.setAPStaticIPConfig(IPAddress(10,0,0,1), IPAddress(10,0,0,1), IPAddress(255,255,255,0));
    WiFiManagerParameter custom_lampCode("lampCode", "lamp.azalupka.cc", "", 36, "minlength=\"36\" maxlength=\"36\"");
    wifiManager.addParameter(&custom_lampCode);
    if(!wifiManager.autoConnect("Lamp")){
        Serial.println("Failed to connect and hit timeout");
        Serial.println("Reboot Your Device");
        delay(1000);
        ESP.restart();
    }

    

    //read lampCode from EEPROM or custom value
    if(custom_lampCode.getValue()[0] != '\0'){
        strcpy(lampCode, custom_lampCode.getValue());
        EEPROM.begin(37);
        EEPROM.put(0, lampCode);
        EEPROM.write(36, 'd');
        EEPROM.write(37, '\0'); //make sure last char is null
        EEPROM.commit();
        EEPROM.end();

    }
    EEPROM.begin(37);
    EEPROM.get(0, lampCode);
    EEPROM.end();

    //socketio connection and event handler
    socketIO.begin(server, port, "/socket.io/?EIO=4"); //TODOODODDDDDDDDDDDDOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
    socketIO.onEvent(socketIOEvent);
    while(!socketIO.isConnected()) {
        socketIO.loop();
        
        //feature of reset
        readSensors();
        if(state.button){
            ESP.eraseConfig();
            ESP.restart();
        }
    }
    
    state.led = 0; //connected, turn off led
    updateOutputs();

    USE_SERIAL.println("CONNECTED, GOING TO LOOP!");
}

void loop() {
    socketIO.loop();
    readSensors();
    updateOutputs();

    if(!didShaked && socketIO.isConnected()){
        emit("addconnection", lampCode); 
    }

    //handle reset button
    if(state.button){
        ESP.eraseConfig();
        ESP.restart();
    }

    //check sensor differences
    if(socketIO.isConnected()){
        state.led = 0;
        if(oldState.brightness != state.brightness) emit("brightness", (float) state.brightness);
        if(oldState.temperature != state.temperature) emit("temperature", (float) state.temperature);
        if(oldState.motion != state.motion) emit("motion", (float) state.motion);
    }else{
        state.led = 1;
    }
}

void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) {
    switch(type) {
        case sIOtype_DISCONNECT:
            USE_SERIAL.printf("[IOc] Disconnected!\n");
            didShaked = false;
            break;
        case sIOtype_CONNECT:
            USE_SERIAL.printf("[IOc] Connected to url: %s\n", payload);

            // join default namespace (no auto join in Socket.IO V3)
            socketIO.send(sIOtype_CONNECT, "/");

            //give lamp code
            emit("addconnection", lampCode); 

            break;
        case sIOtype_EVENT:
            USE_SERIAL.printf("[IOc] get event: %s\n", payload);
            eventHandler(payload);
            break;
        case sIOtype_ACK:
            USE_SERIAL.printf("[IOc] get ack: %u\n", length);
            hexdump(payload, length);
            break;
        case sIOtype_ERROR:
            USE_SERIAL.printf("[IOc] get error: %u\n", length);
            hexdump(payload, length);
            break;
        case sIOtype_BINARY_EVENT:
            USE_SERIAL.printf("[IOc] get binary: %u\n", length);
            hexdump(payload, length);
            break;
        case sIOtype_BINARY_ACK:
            USE_SERIAL.printf("[IOc] get binary ack: %u\n", length);
            hexdump(payload, length);
            break;
    }
}

void readSensors(){ //save sensors to state
    //save old values
    oldState.brightness = state.brightness;
    oldState.temperature = state.temperature;
    oldState.motion = state.motion;
    oldState.button = state.button;

    // brightness
    state.brightness = analogRead(PINS.brightness);

    // temperature
    temperatureSensors.requestTemperatures();
    state.temperature = temperatureSensors.getTempCByIndex(0);

    // motion
    state.motion = digitalRead(PINS.motion);

    //button
    state.button = !digitalRead(PINS.button);
}

void updateOutputs(){
    //angle
    servo.write(state.angle); //0-180 (180 lewo, 90 srodek, 0 prawo)
    
    //power
    analogWrite(PINS.power, state.power);

    //led
    digitalWrite(PINS.led, state.led);
}

void emit(String event, float value){
    // creat JSON message for Socket.IO (event)
    DynamicJsonDocument doc(1024);
    JsonArray array = doc.to<JsonArray>();

    // add evnet name
    // Hint: socket.on('event_name', ....
    array.add(event);

    // add payload (parameters) for the event
    // JsonObject params = array.createNestedObject();
    // params["now"] = (uint32_t) 13;
    array.add(value);

    // JSON to String (serializion)
    String output;
    serializeJson(doc, output);

    // Send event
    socketIO.sendEVENT(output);

    // Print JSON for debugging
    USE_SERIAL.println(output);
}

void emit(String event, String value){
    // creat JSON message for Socket.IO (event)
    DynamicJsonDocument doc(1024);
    JsonArray array = doc.to<JsonArray>();

    // add evnet name
    // Hint: socket.on('event_name', ....
    array.add(event);

    // add payload (parameters) for the event
    // JsonObject params = array.createNestedObject();
    // params["now"] = (uint32_t) 13;
    array.add(value);

    // JSON to String (serializion)
    String output;
    serializeJson(doc, output);

    // Send event
    socketIO.sendEVENT(output);

    // Print JSON for debugging
    USE_SERIAL.println(output);
}

void eventHandler(uint8_t * payload){
    StaticJsonDocument<2> doc;
    deserializeJson(doc, payload);
    JsonArray array = doc.as<JsonArray>();

    JsonVariant e = array[0];
    JsonVariant v = array[1];
    if (strcmp(e.as<String>().c_str(), "power") == 0){
        state.power = v.as<int>();
    }
    if (strcmp(e.as<String>().c_str(), "angle") == 0){
        state.angle = v.as<int>();
    }
    if (strcmp(e.as<String>().c_str(), "addconnection") == 0){
        didShaked = true;
    }
}
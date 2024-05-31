# iot-lamp

## Wstęp
Projekt to lampka sterowana poprzez stronę internetową. Podstawowe funkcje:
- czujnik jasności otoczenia
- termometr
- czujnik ruchu
- regulacja kąta świecenia
- regulacja mocy świecenia

Założeniem również było, aby lampka była konfgurowalna. Infrastruktura musi być też gotowa na to, aby lampek takich mogło być wiele i mogli korzystać z nich symultanicznie, ale oddzielnie różni użytkownicy (każdy może zarządzać swoimi lampkami).

Konieczna jest też osobna dioda LED, sygnalizująca stan lampki oraz przycisk służący do resetu lampki.

Kolejnym założeniem jest, aby elementem święcącym w lampce, była żarówka H7. Trudnością jest fakt, że potrzebne jest jej napięcie 12V, podczas gdy mikrokontroler potrzebuje dużo niższe napięcie (3.3V lub 5V). Rozwiązanie zasilania w lampce zostanie opisane w części konstrukcji lampki.

## Architektura systemu
Założeniem jest, aby lampka była dostępna z poziomu internetu. Tym samym potrzebny jest centralny serwer dostępny w internecie. Do serwera muszą się dołączać lampki oraz użytkownicy. Stąd pełna aplikacja zawiera:
- klient (strona WWW - `Next.js`)
- serwer (aplikacja - `Express.js`, baza danych `SQLite`)
- urządzenie (mikrokontroler `ESP8266`)
Za komunikację w czasie rzeczywistym odpowiada `socket.io`

## Wykorzystany mikrokontroler
Przy wyborze mikrokontrolera, główna uwaga padła na stosunek ceny do możliwości. Koniecznym była możliwość połączenia z internetem, odpowiednią ilość złącz GPIO oraz wsparcie protokołu I2C. Po odrzuceniu Raspberry, ze względu na chęć postawienia sobie wyzwania w postaci mikrokontrolera, wybór padł na płytkę NodeMCU v3. Zbudowana jest ona na podstawie mikrokontrolera Espressif ESP8266EX.

![Mikrokontroler ESP8266](https://botland.com.pl/img/art/inne/08241_8.jpg)\
Zdjęcie ze sklepu [Botland](https://botland.com.pl)

## Środkowisko programistyczne
Projekt został zrobiony przy pomocy edytora Visual Studio Code oraz środowiska PlatformIO.
Kod na urządzenie był pisany we frameworku Arduino. 

## Wykorzystane czujniki
- czujnik natężenia światła `TEMT6000`
![Czujnik TEMT6000](https://github.com/azizko1337/iot-lamp/blob/main/docs/images/temt6000.png?raw=true)\
![Specyfikacja TEMT6000](https://github.com/azizko1337/iot-lamp/blob/main/docs/images/temt6000spec.png?raw=true)\
Zdjęcie i specyfikacja pochodzą z aukcji w serwisie [Allegro](https://allegro.pl)

- czujnik temperatury `DS18B20`
![Czujnik DS18B20](https://github.com/azizko1337/iot-lamp/blob/main/docs/images/ds18b20.png?raw=true)\
![Specyfikacja DS18B20](https://github.com/azizko1337/iot-lamp/blob/main/docs/images/ds18b20spec.png?raw=true)\
Zdjęcie i specyfikacja pochodzą z aukcji w serwisie [Allegro](https://allegro.pl)

- czujnik ruchu PIR `HC-SR505`
![Czujnik HC-SR505](https://github.com/azizko1337/iot-lamp/blob/main/docs/images/hcsr505.png?raw=true)\
![Specyfikacja HC-SR505](https://github.com/azizko1337/iot-lamp/blob/main/docs/images/hcsr505spec.png?raw=true)\
Zdjęcie i specyfikacja pochodzą z aukcji w serwisie [Allegro](https://allegro.pl)

## Wykorzystane aktuatory:
- serwo `g90` *do regulacji kąta świecenia*
![Serwo g90](https://github.com/azizko1337/iot-lamp/blob/main/docs/images/servog90.png?raw=true)\
![Specyfikacja serwa g90](https://github.com/azizko1337/iot-lamp/blob/main/docs/images/servog90spec.png?raw=true)\
Zdjęcie i specyfikacja pochodzą z aukcji w serwisie [Allegro](https://allegro.pl)

- sterownik PWM MOSFET 3.3V/5V | 15A 5-36V *do regulacji mocy świecenia*
![Sterownik PWM](https://github.com/azizko1337/iot-lamp/blob/main/docs/images/pwm.png?raw=true)\
![Specyfikacja sterownika PWM](https://github.com/azizko1337/iot-lamp/blob/main/docs/images/pwmspec.png?raw=true)\
Zdjęcie i specyfikacja pochodzą z aukcji w serwisie [Allegro](https://allegro.pl)

## Sekcja zasilania lampki
Użyty został zasilacz 5V 5A. Równolegle podłączone zostały:
- mikrokontroler `ESP8266` (bezpośrednio do 5V)
- żarówka `H7` *(przy pomocy grubszych kabli)*, poprzez przetwornicę `MT3608` Step-UP 5-28V 2A

###### Zasilacz
![Zasilacz](https://github.com/azizko1337/iot-lamp/blob/main/docs/images/powersupply.png?raw=true)\
Zdjęcie i specyfikacja zasilacza pochodzą z aukcji w serwisie [Allegro](https://allegro.pl)

###### Przetwornica step-up (ustawiona na 5V -> 12V)
![Przetwornica step-up](https://github.com/azizko1337/iot-lamp/blob/main/docs/images/stepup.png?raw=true)\
![Przetwornica step-up](https://github.com/azizko1337/iot-lamp/blob/main/docs/images/stepupspec.png?raw=true)\
Zdjęcie i specyfikacja zasilacza pochodzą z aukcji w serwisie [Allegro](https://allegro.pl)

## Schemat lampki
![Schemat lampki](https://github.com/azizko1337/iot-lamp/blob/main/docs/images/circuit-colored.png?raw=true)\
Schemat wykonany przy pomocy [circuit-diagram.org](https://www.circuit-diagram.org/)

#### Legenda:
- kolor czerwony - sekcja zasilania lampki *(linie 5V i 12V)*
- kolor zielony - sekcja aktuatorów *(regulacja kąta oraz mocy świecenia)*
- kolor niebieski - sekcja czujników *(ruchu, temperatury oraz światła)*
- kolor żółty - sekcja sterowania *(przycisk reset oraz dioda stanu)*

#### Połączenie żarówki `H7` z mikrokontrolerem
Żarówka nie jest połączona bezpośrednio z mikrokontrolerem, lecz poprzez, wcześniej opisany, sterownik PWM. Mikrokontroler operuje na napięciu 3.3V, a lampka na napięciu 12V.

## Programowanie czujników oraz aktuatorów, użyte biblioteki
Urządzenie swoje działanie zawdzięcza wielu gotowym bibliotekom.

#### Czujnik natężenia światła `TEMT6000`
- czujnik nie wymagał bibliotek, został podpięty do wejścia analogowego

#### Czujnik temperatury `DS18B20`
- [PaulStoffregen - OneWire](https://github.com/PaulStoffregen/OneWire) - użyte do obsługi protokołu 1wire
- [milesburton - DallasTemperature](https://github.com/milesburton/Arduino-Temperature-Control-Library) - użyte do odczytu danych z czujnika

#### Czujnik ruchu PIR `HC-SR505`
- czujnik nie wymagał bibliotek, został podpięty do wejścia cyfrowego

#### Serwo g90
- [Servo](https://www.arduino.cc/reference/en/libraries/servo/) - biblioteka wbudowana we framework Arduino, uprościła sterowanie serwem

#### sterownik PWM
- nie wymagał bibliotek, do sterowania `PWM` wystarczyła wbudowana funkcja `analogWrite` 

#### łączność, WiFi
- [tzapu - WiFiManager](https://github.com/tzapu/WiFiManager) - użyte do konfigurowania sieci WiFi na urządzeniu
- [gilmaimon - ArduinoWebsockets](https://github.com/gilmaimon/ArduinoWebsockets) - użyte do połączenia WebSocket 
- [Links2004 - arduinoWebSockets](https://github.com/Links2004/arduinoWebSockets) - wraz z powyższa biblioteką, razem pozwoliły komunikować się przez SocketIO
- [bblanchon - ArduinoJson](https://github.com/bblanchon/ArduinoJson) - użyte do przedstawiania danych w formacie JSON, przy komunikacji z serwerem

#### Framework - [Arduino](https://docs.platformio.org/en/stable/frameworks/arduino.html)

## Wnioski
- Projekt lampki IoT został zrealizowany z wykorzystaniem mikrokontrolera ESP8266, czujników natężenia światła, temperatury i ruchu oraz aktuatorów do regulacji kąta i mocy świecenia.
- Wykorzystano biblioteki takie jak OneWire, DallasTemperature, Servo, WiFiManager, ArduinoWebsockets i ArduinoJson do programowania czujników, aktuatorów i komunikacji z serwerem.
- Lampka jest konfigurowalna i dostępna z poziomu internetu, dzięki wykorzystaniu centralnego serwera i technologii WebSocket.
- Projekt został zrealizowany przy użyciu edytora Visual Studio Code i środowiska PlatformIO.
- W celu zasilania lampki wykorzystano zasilacz 5V 5A oraz przetwornicę MT3608 Step-UP 5-28V 2A.
- Schemat lampki został wykonany przy pomocy narzędzia circuit-diagram.org.

## Źródła informacji
- [ESP8266 - jak zacząć?](https://forbot.pl/blog/leksykon/esp8266)
- [WiFiManager with ESP8266](https://randomnerdtutorials.com/wifimanager-with-esp8266-autoconnect-custom-parameter-and-manage-your-ssid-and-password/)
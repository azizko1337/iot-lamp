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

## Prezentacja efektu końcowego

Film pozwala zrozumieć zamysł projektu.

[<img src="https://img.youtube.com/vi/iD7eQsk9eG4/hqdefault.jpg" alt="Zobacz film" width="360">](https://youtu.be/iD7eQsk9eG4)<br>

## Architektura systemu

Założeniem jest, aby lampka była dostępna z poziomu internetu. Tym samym potrzebny jest centralny serwer dostępny w internecie. Do serwera muszą się dołączać lampki oraz użytkownicy. Stąd pełna aplikacja zawiera:

- klient (strona WWW - `Next.js`)
- serwer (aplikacja - `Express.js`, baza danych `SQLite`)
- urządzenie (mikrokontroler `ESP8266`)

##### Za komunikację w czasie rzeczywistym odpowiada `socket.io`

## Środkowisko programistyczne

Projekt został zrobiony przy pomocy edytora Visual Studio Code oraz środowiska PlatformIO.
Kod na urządzenie był pisany we frameworku Arduino.

## Wykorzystany mikrokontroler

Przy wyborze mikrokontrolera, główna uwaga padła na stosunek ceny do możliwości. Koniecznym była możliwość połączenia z internetem, odpowiednią ilość złącz GPIO oraz wsparcie protokołu I2C. Po odrzuceniu Raspberry, ze względu na chęć postawienia sobie wyzwania w postaci mikrokontrolera, wybór padł na płytkę NodeMCU v3. Zbudowana jest ona na podstawie mikrokontrolera Espressif ESP8266EX.

<img src="https://botland.com.pl/img/art/inne/08241_8.jpg" alt="Mikrokontroler ESP8266" width="360"><br>
Zdjęcie ze sklepu [Botland](https://botland.com.pl)

## Wykorzystane czujniki

- czujnik natężenia światła `TEMT6000`\
  <img src="https://github.com/azizko1337/iot-lamp/blob/main/docs/images/temt6000.png?raw=true" alt="Czujnik TEMT6000" width="360"><br>
  <img src="https://github.com/azizko1337/iot-lamp/blob/main/docs/images/temt6000spec.png?raw=true" alt="Specyfikacja TEMT6000" width="360"><br>
  Zdjęcie i specyfikacja pochodzą z aukcji w serwisie [Allegro](https://allegro.pl)

- czujnik temperatury `DS18B20`\
  <img src="https://github.com/azizko1337/iot-lamp/blob/main/docs/images/ds18b20.png?raw=true" alt="Czujnik DS18B20" width="360"><br>
  <img src="https://github.com/azizko1337/iot-lamp/blob/main/docs/images/ds18b20spec.png?raw=true" alt="Specyfikacja DS18B20" width="360"><br>
  Zdjęcie i specyfikacja pochodzą z aukcji w serwisie [Allegro](https://allegro.pl)

- czujnik ruchu PIR `HC-SR505`\
  <img src="https://github.com/azizko1337/iot-lamp/blob/main/docs/images/hcsr505.png?raw=true" alt="Czujnik HC-SR505" width="360"><br>
  <img src="https://github.com/azizko1337/iot-lamp/blob/main/docs/images/hcsr505spec.png?raw=true" alt="Specyfikacja HC-SR505" width="360"><br>
  Zdjęcie i specyfikacja pochodzą z aukcji w serwisie [Allegro](https://allegro.pl)

## Wykorzystane aktuatory:

- serwo `g90` _do regulacji kąta świecenia_\
  <img src="https://github.com/azizko1337/iot-lamp/blob/main/docs/images/servog90.png?raw=true" alt="Serwo g90" width="360"><br>
  <img src="https://github.com/azizko1337/iot-lamp/blob/main/docs/images/servog90spec.png?raw=true" alt="Specyfikacja serwa g90" width="360"><br>
  Zdjęcie i specyfikacja pochodzą z aukcji w serwisie [Allegro](https://allegro.pl)

- sterownik PWM MOSFET 3.3V/5V | 15A 5-36V _do regulacji mocy świecenia_\
  <img src="https://github.com/azizko1337/iot-lamp/blob/main/docs/images/pwm.png?raw=true" alt="Sterownik PWM" width="360"><br>
  <img src="https://github.com/azizko1337/iot-lamp/blob/main/docs/images/pwmspec.png?raw=true" alt="Specyfikacja sterownika PWM" width="360"><br>
  Zdjęcie i specyfikacja pochodzą z aukcji w serwisie [Allegro](https://allegro.pl)

## Sekcja zasilania lampki

Użyty został zasilacz 5V 5A. Równolegle podłączone zostały:

- mikrokontroler `ESP8266` (bezpośrednio do 5V)
- żarówka `H7` _(przy pomocy grubszych kabli)_, poprzez przetwornicę `MT3608` Step-UP 5-28V 2A

###### Zasilacz

<img src="https://github.com/azizko1337/iot-lamp/blob/main/docs/images/powersupply.png?raw=true" alt="Zasilacz" width="360"><br>
Zdjęcie i specyfikacja zasilacza pochodzą z aukcji w serwisie [Allegro](https://allegro.pl)

###### Przetwornica step-up (ustawiona na 5V -> 12V)

<img src="https://github.com/azizko1337/iot-lamp/blob/main/docs/images/stepup.png?raw=true" alt="Przetwornica step-up" width="360"><br>
<img src="https://github.com/azizko1337/iot-lamp/blob/main/docs/images/stepupspec.png?raw=true" alt="Przetwornica step-up specyfikacja" width="360"><br>
Zdjęcie i specyfikacja zasilacza pochodzą z aukcji w serwisie [Allegro](https://allegro.pl)

## Schemat lampki

<img src="https://github.com/azizko1337/iot-lamp/blob/main/docs/images/circuit-colored.png?raw=true" alt="Schemat lampki" width="360"><br>
Schemat wykonany przy pomocy [circuit-diagram.org](https://www.circuit-diagram.org/)

#### Legenda:

- kolor czerwony - sekcja zasilania lampki _(linie 5V i 12V)_
- kolor zielony - sekcja aktuatorów _(regulacja kąta oraz mocy świecenia)_
- kolor niebieski - sekcja czujników _(ruchu, temperatury oraz światła)_
- kolor żółty - sekcja sterowania _(przycisk reset oraz dioda stanu)_

#### Połączenie żarówki `H7` z mikrokontrolerem

Żarówka nie jest połączona bezpośrednio z mikrokontrolerem, lecz poprzez, wcześniej opisany, sterownik PWM. Mikrokontroler operuje na napięciu 3.3V, a lampka na napięciu 12V.

#### Sekcja sterowania lampką

Sekcja sterowania skląda się z:

- przycisku RESET - po przyciśnięciu go lampka usuwa z pamięci hasło do WiFi i kod lampki, a następnie uruchamia sie ponownie
- dioda stanu - dioda ta gaśnie, gdy lampka nawiąże połaczenie z serwerem

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
- Reszta informacji potrzebnych do wykonania projektu została zaczerpnięta z zajęć oraz dokumentacji w/w bibliotek.

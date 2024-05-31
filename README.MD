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

![Mikrokontroler ESP8266](https://botland.com.pl/img/art/inne/08241_8.jpg)
Zdjęcie ze sklepu (Botland)[https://botland.com.pl]

## Środkowisko programistyczne
Projekt został zrobiony przy pomocy edytora Visual Studio Code oraz środowiska PlatformIO.
Kod na urzędzenie był pisany we frameworku Arduino. 

## Wykorzystane czujniki
- czujnik natężenia światła `TEMT6000`
- czujnik temperatury `DS18B20`
- czujnik ruchu PIR `HC-SR505`

## Wykorzystane aktuatory:
- serwo `g90` *do regulacji kąta świecenia*
- sterownik PWM MOSFET 3.3V/5V | 15A 5-36V *do regulacji mocy świecenia*

## Sekcja zasilania lampki
Użyty został zasilacz 5V 5A. Równolegle podłaczone zostały:
- mikrokontroler `ESP8266` (bezpośrednio do 5V)
- żarówka `H7` *(przy pomocy grubszych kabli)*, poprzez przetwornicę `MT3608` Step-UP 5-28V 2A


## Schemat lampki

![Schemat lampki](https://github.com/azizko1337/iot-lamp/blob/main/docs/circuit-colored.png?raw=true)
Schemat wykonany przy pomocy [circuit-diagram.org](https://www.circuit-diagram.org/)

#### Legenda:
- kolor czerwony - sekcja zasilania lampki (linie 5V i 12V)
- kolor zielony - sekcja aktuatorów (regulacja kąta oraz mocy świecenia)
- kolor niebieski - sekcja czujników (ruchu, temperatury oraz światła)
- kolor żółty - sekcja sterowania (przycisk reset oraz dioda stanu)

#### Połączenie żarówki `H7` z mikrokontrolerem
Żarówka nie jest połączona bezpośrednio z mikrokontrolerem, lecz poprzez, wcześniej opisany, sterownik PWM. Mikrokontroler operuje na napięciu 3.3V, a lampka na napięciu 12V.

## Programowanie czujników oraz aktuatorów


## Wnioski

## 

## Bibliografia

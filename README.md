Install Arduino https://www.arduino.cc/en/Guide/Linux 
- cd GrowPi2
- wget https://downloads.arduino.cc/arduino-1.8.9-linuxarm.tar.xz
- tar -xf arduino-1.8.9-linuxarm.tar.xz
- cd arduino-1.8.9
- ./install.sh
- cd ..
- rm -rf arduino-1.8.9/
- rm arduino-1.8.9-linuxarm.tar.xz
- arduino --install-library OneWire
- arduino --install-library DallasTemperature
- arduino --install-library "Adafruit Unified Sensor"
- arduino --install-library "Adafruit TSL2591 Library"
- sudo apt update -y
- sudo apt-get install python-pip
- curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
- sudo apt install nodejs
- sudo npm install -g typescript
- pip install pyserial
- arduino --upload --port /dev/ttyACM0 arduino/growpi.ino
- python listen.py

CREATE TABLE Readings(
UTCTime DateTime,
Lux Int,
IR Int, 
FullLux Int, 
Temperature Float, 
Moisture Int, 
Relays TinyInt
);
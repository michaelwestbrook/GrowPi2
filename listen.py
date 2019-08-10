from datetime import datetime
import time
import serial
import os
import threading

TIMEOUT = 1
arduino = serial.Serial('/dev/ttyACM0', 9600, timeout=.1)
if not os.path.exists("logs"):
    os.makedirs("logs")
timestr = "logs/" + datetime.utcnow().strftime("%Y%m%d-%H%M%S") + ".gpi"
fileOut = open(timestr, "w+")
print "Logging to: " + timestr


def readArduino():
    now = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    data = arduino.readline()[:-1]
    attempts = 0
    while not data and attempts <= 100:
        data = arduino.readline()[:-1]
        attempts = attempts + 1

    if data :
        out = now + ":" + data
        print out
        fileOut.writelines(out + "\n")
        fileOut.flush()
        os.fsync(fileOut.fileno())

command = 3
sensors = 7
relays = 0
while True:
    try:
        arduino.write([command, sensors, relays])
        time.sleep(TIMEOUT)
        readArduino()
        relays = (relays + 1) % 256
    except (KeyboardInterrupt, SystemExit):
        print "\nexiting gracefully"
        arduino.write([2, 0, 0])
        raise

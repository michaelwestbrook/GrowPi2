from datetime import datetime
import time
import serial
import os
import threading

TIMEOUT = 1
arduino = serial.Serial('/dev/ttyACM0', 9600, timeout=.1)
timestr = datetime.utcnow().strftime("%Y%m%d-%H%M%S") + ".gpi"
fileOut = open(timestr, "w+")
print "Logging to: " + timestr


def readArduino():
    now = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    data = arduino.readline()[:-1]
    while not data:
        data = arduino.readline()[:-1]

    out = now + ":" + data
    print out
    fileOut.writelines(out)
    fileOut.flush()
    os.fsync(fileOut.fileno())

relays = 0
while True:
    try:
        command = 3
        sensors = 6
        if command >= 0 and command < 256 and sensors >= 0 and sensors < 8 and relays >= 0 and relays < 256:
            arduino.write([command, sensors, relays])
            time.sleep(TIMEOUT)
            readArduino()
            relays = (relays + 1) % 256
        else:
            print "Got unexpected commands"
    except (KeyboardInterrupt, SystemExit):
        print "\nexiting gracefully"
        arduino.write([2, 0, 0])
        raise

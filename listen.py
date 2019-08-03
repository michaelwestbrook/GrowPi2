from datetime import datetime
import time
import serial
import os
import threading 

TIMEOUT = 5
arduino = serial.Serial('/dev/ttyACM0', 9600, timeout=.1)
timestr = datetime.utcnow().strftime("%Y%m%d-%H%M%S") + ".gpi"
fileOut = open(timestr, "w+")
print "Logging to: " + timestr
def timed():
    now = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    arduino.write(100)
    data = arduino.readline()[:-1]
    out = now + ":" + data
    print out
    fileOut.write(out)
    fileOut.flush()
    os.fsync(fileOut.fileno())

while True:
    timed()
    time.sleep(TIMEOUT)

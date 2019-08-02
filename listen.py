from datetime import datetime
import serial
import os
import threading 

TIMEOUT = 3
arduino = serial.Serial('/dev/ttyACM0', 9600, timeout=.1)
timestr = datetime.utcnow().strftime("%Y%m%d-%H%M%S") + ".gpi"
fileOut = open(timestr, "w+")
print "Logging to: " + timestr
def timed():
    arduino.write(32)
    data = arduino.readline()
    if data:
        out = datetime.utcnow().strftime("%Y%m%d-%H%M%S") + ":" + data
        print out
        fileOut.write(out)
        fileOut.flush()
        os.fsync(fileOut.fileno())
    threading.Timer(TIMEOUT, timed).start()

timed()

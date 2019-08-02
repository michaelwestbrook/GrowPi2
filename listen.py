from datetime import datetime
import serial
import os

arduino = serial.Serial('/dev/ttyACM0', 9600, timeout=.1)
timestr = datetime.utcnow().strftime("%Y%m%d-%H%M%S") + ".gpi"
fileOut = open(timestr, "w+")
print "Logging to: " + timestr
while True:
    data = arduino.readline()
    if data:
        out = datetime.utcnow().strftime("%Y%m%d-%H%M%S") + ":" + data
        print(out)
        fileOut.write(out)
        fileOut.flush()
        os.fsync(fileOut.fileno())

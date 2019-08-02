import time
import serial
import os
arduino = serial.Serial('/dev/ttyACM0', 9600, timeout = .1)
timestr = time.strftime("%Y%m%d-%H%M%S") + ".gpi"
fileOut = open(timestr, "w+")
print "Logging to: " + timestr
while True:
    data = arduino.readline()
    if data:
        print(data)
        fileOut.write(data)
        fileOut.flush()
        os.fsync(fileOut.fileno())

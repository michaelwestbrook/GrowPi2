from datetime import datetime
import time
import serial
import os
import threading

TIMEOUT = 0.5
arduino = serial.Serial('/dev/ttyACM0', 9600, timeout=.1)
# arduino.reset_input_buffer()
# arduino.reset_output_buffer()
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


while True:
    try:
        command = input("command: ")
        sensors = input("Sensors: ")
        relays = input("Relays: ")
        arduino.write([command, sensors, relays])
        time.sleep(TIMEOUT)
        readArduino()
    except (KeyboardInterrupt, SystemExit):
        print "\nexiting gracefully"
        arduino.write([2, 0, 0])
        raise

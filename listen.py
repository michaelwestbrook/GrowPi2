import serial
arduino = serial.Serial('/dev/ttyACM0', 9600, timeout=.1)
val = input("Enter a char")
print(val)
while True:
    # i = input("Enter Char")
    # arduino.write(i)
	data = arduino.readline()[:-2] #the last bit gets rid of the new-line chars
	if data:
		print data

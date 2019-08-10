import SerialPort from 'serialport';
const port = new SerialPort('/dev/ttyACM0', { baudRate: 9600 });
// Read data that is available but keep the stream in "paused mode"
port.on('readable', () => console.log('Data:', port.read()));

// Switches the port into "flowing mode"
port.on('data', data => console.log('Data:', data));
port.on('error', err => console.log('Error: ', err.message));
port.write([3, 7, 255], err => {
    if (err) {
        console.error(err);
    }

    console.log('written')
});
import SerialPort from "serialport";
const port = new SerialPort("/dev/ttyACM0", { baudRate: 9600 });

function prefixPrint(prefix: string, data: string | Buffer | null) {
  if (data && data[0] === -1) {
    console.log("END");
  }
  console.log(`${prefix}: ${data}`);
}

let relays = 0;
function timed() {
  setTimeout(() => port.write([3, 7, relays], (err) => {
    if (err) {
      console.error(err);
    }
    relays = (relays + 1) % 256;
    timed();
  }), 5000);
}
// Read data that is available but keep the stream in "paused mode"
port.on("readable", () => prefixPrint("Data", port.read()));

// Switches the port into "flowing mode"
// port.on("data", (data) => prefixPrint("Flow", data));
port.on("error", (err) => prefixPrint("Error", err.message));

timed();

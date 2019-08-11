import SerialPort from "serialport";
const port = new SerialPort("/dev/ttyACM0", { baudRate: 9600 });
port.on("open", () => port.flush((err) => {
  if (err) {
    console.error(err);
  }
}));

let relays = 0;
function timed() {
  setTimeout(() => port.write([3, 7, relays], (err) => {
    if (err) {
      console.error(err);
    }

    console.log(`Write ${relays}`);
    relays = (relays + 1) % 256;
    timed();
  }), 20000);
}
// Read data that is available but keep the stream in "paused mode"
port.on("readable", () => setTimeout(() => {
  const data = port.read();
  if (data) {
    try {
      const dataObj = JSON.parse(data.toString());
      dataObj.time = Date.now();
      console.log(JSON.stringify(dataObj, null, 2));
    } catch (error) {
      console.error(`Bad data! Bad!: ${data}`);
    }
  }
}, 1000));

// Switches the port into "flowing mode"
// port.on("data", (data) => prefixPrint("Flow", data));
port.on("error", console.error);

timed();

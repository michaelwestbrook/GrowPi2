import ArduinoCommunicator from "./arduino-communicator";
import GrowPiReading from "./growpi-reading";
const communicator = new ArduinoCommunicator();
communicator.addListener({
  readingReceived: (readings: GrowPiReading[]) => {
    console.log(JSON.stringify(readings, null, 2));
  },
});

communicator.start()
  .then(timed);

let relays = 0;
function timed() {
  setTimeout(() => communicator.write([3, 7, relays])
    .then(() => relays = (relays + 1) % 256)
    .then(timed), 20000);
}

import ArduinoCommunicator from "./arduino-communicator";
const communicator = new ArduinoCommunicator();
communicator.start()
  .then(timed);

let relays = 0;
function timed() {
  setTimeout(() => communicator.write([3, 7, relays])
    .then(() => relays = (relays + 1) % 256)
    .then(timed), 20000);
}

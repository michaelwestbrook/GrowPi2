import ArduinoCommunicator from "./arduino-communicator";
import FileListener from "./file-listener";

const communicator = new ArduinoCommunicator();
communicator.addListener(new FileListener());

communicator.start()
  .then(timed);

let relays = 0;
function timed() {
  setTimeout(() => communicator.write([3, 7, relays])
    .then(() => relays = (relays + 1) % 256)
    .then(timed), 20000);
}

import ArduinoCommunicator from "./arduino-communicator";
import { AzureSQLListener } from "./sql-listener";

const communicator = new ArduinoCommunicator();
communicator.addListener(new AzureSQLListener());

communicator.start()
  .then(timed);

let relays = 0;
function timed() {
  setTimeout(() => communicator.write([3, 7, relays])
    .then(() => relays = (relays + 1) % 256)
    .then(timed), 3000);
}

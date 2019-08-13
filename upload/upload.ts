import ArduinoCommunicator from "./arduino-communicator";
import ServiceBusListener from "./servicebus-listener";

const communicator = new ArduinoCommunicator();
communicator.addListener(
  new ServiceBusListener(process.env.GROWPI_SERVICEBUS_CONN_STR ? process.env.GROWPI_SERVICEBUS_CONN_STR : ""));

communicator.start()
  .then(timed);

let relays = 0;
function timed() {
  setTimeout(() => communicator.write([3, 7, relays])
    .then(() => relays = (relays + 1) % 256)
    .then(timed), 30000);
}

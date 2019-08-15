import ArduinoCommunicator from "./arduino-communicator";
import ConsoleListener from "./console-listener";
import ServiceBusListener from "./servicebus-listener";
import { AzureSQLListener } from "./sql-listener";

const communicator = new ArduinoCommunicator();

communicator.addListener(new ConsoleListener());
if (process.env.GROWPI_SQL_PASSWORD) {
  communicator.addListener(new AzureSQLListener(process.env.GROWPI_SQL_PASSWORD));
}

if (process.env.GROWPI_SERVICEBUSS_CONN_STR) {
  communicator.addListener(new ServiceBusListener(process.env.GROWPI_SERVICEBUSS_CONN_STR));
}

communicator.start()
  .then(timed);

let relays = 0;
function timed() {
  setTimeout(() => communicator.write([3, 7, relays])
    .then(() => relays = (relays + 1) % 256)
    .then(timed), 3000);
}

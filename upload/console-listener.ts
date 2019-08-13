import { IGrowPiListener } from "./arduino-communicator";
import GrowPiReading from "./growpi-reading";

export class ConsoleListener implements IGrowPiListener {
  public readingReceived(readings: GrowPiReading[]) {
    console.log(JSON.stringify(readings, null, 2));
  }

  public error(error: Error) {
    console.error(error);
  }
}

export default ConsoleListener;

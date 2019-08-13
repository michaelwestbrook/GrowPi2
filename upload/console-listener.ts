import { IGrowPiListener } from "./arduino-communicator";
import GrowPiReading from "./growpi-reading";

export class ConsoleListener implements IGrowPiListener {
  public readingReceived(readings: GrowPiReading[]) {
    // tslint:disable-next-line: no-console
    console.log(JSON.stringify(readings, null, 2));
  }

  public error(error: Error) {
    // tslint:disable-next-line: no-console
    console.error(error);
  }
}

export default ConsoleListener;

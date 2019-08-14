import fs, { WriteStream } from "fs";
import { IGrowPiListener } from "./arduino-communicator";
import GrowPiReading from "./growpi-reading";

export class FileListener implements IGrowPiListener {
  private stream: WriteStream;
  private errorStream: WriteStream;
  constructor() {
    const now = Date.now();
    if (!fs.existsSync("./logs")) {
      fs.mkdirSync("./logs");
    }

    this.stream = fs.createWriteStream(`./logs/${now}.log`, { flags: "a" });
    this.errorStream = fs.createWriteStream(`./logs/${now}.error.log`, { flags: "a" });
  }
  public readingReceived(readings: GrowPiReading[]) {
    this.stream.write(JSON.stringify(readings, null, 2));
  }

  public error(error: Error) {
    this.errorStream.write(error);
  }
}

export default FileListener;

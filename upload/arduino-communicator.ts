import SerialPort from "serialport";
import GrowPiReading from "./growpi-reading";
import SerialJsonParser from "./SerialJsonParser";

export interface IGrowPiListener {
  readingReceived(readings: GrowPiReading[]): void;
}

export class ArduinoCommunicator {
  private serialPort: SerialPort;

  private listening: boolean = false;

  private listeners: IGrowPiListener[] = [];

  constructor(port: string = "/dev/ttyACM0", baudRate: number = 9600) {
    this.serialPort = new SerialPort(port, { baudRate, autoOpen: false });
  }

  public start(): Promise<void> {
    this.serialPort.on("error", (serialError) => this.onError(serialError));
    this.serialPort.on("open", () => this.onOpen());
    this.serialPort.on("readable", () => this.onReadable());
    return new Promise((resolve, reject) => this.serialPort.open((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    }));
  }

  public write(data: number[]): Promise<number> {
    if (data && data.length > 0) {
      return new Promise((resolve, reject) => {
        this.serialPort.write(data, (error, bytesWritten) => {
          if (error) {
            reject(error);
          } else {
            resolve(bytesWritten);
          }
        });
      });
    }

    return Promise.resolve(0);
  }

  public addListener(listener: IGrowPiListener) {
    if (listener) {
      this.listeners.push(listener);
    }
  }
  private onError(error: Error): void {
    console.error(error);
  }

  private onOpen(): void {
    this.serialPort.flush();
  }

  private onReadable(): void {
    if (!this.listening) {
      this.listening = true;
      setTimeout(() => {
        const data = this.serialPort.read();
        let readings: GrowPiReading[] = [];
        if (data) {
          readings = SerialJsonParser.extractReading(data.toString());
        }

        this.listeners.forEach((listener) => listener.readingReceived(readings));
        this.listening = false;
      }, 1000);
    }
  }
}

export default ArduinoCommunicator;

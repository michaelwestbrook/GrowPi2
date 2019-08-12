import SerialPort from "serialport";

export class ArduinoCommunicator {
  public static listPorts(): void {
    SerialPort.list((error, ports) => {
      if (error) {
        console.error(error);
      } else {
        ports.forEach(console.log);
      }
    });
  }

  private serialPort: SerialPort;

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

  private onError(error: Error): void {
    console.error(error);
  }

  private onOpen(): void {
    this.serialPort.flush();
  }

  private onReadable(): void {
    setTimeout(() => {
      const data = this.serialPort.read();
      if (data) {
        try {
          const dataObj = JSON.parse(data.toString());
          dataObj.time = Date.now();
          console.log(JSON.stringify(dataObj, null, 2));
        } catch (error) {
          console.error(`Bad data! Bad!: ${data}`);
        }
      }
    }, 1000);
  }
}

export default ArduinoCommunicator;

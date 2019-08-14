import { Connection, ConnectionConfig, Request, TYPES } from "tedious";
import { IGrowPiListener } from "./arduino-communicator";
import GrowPiReading from "./growpi-reading";

export class AzureSQLListener implements IGrowPiListener {
  private readonly config: ConnectionConfig = {
    authentication: {
      options: {
        password: "",
        userName: "pi",
      },
      type: "default",
    },
    options: {
      database: "growpi",
      encrypt: true,
    },
    server: "growpidata.database.windows.net",
  };

  private readonly connection: Connection;

  constructor() {
    this.connection = new Connection(this.config);
  }

  public connect(): Promise<void> {
    return Promise.resolve();
  }

  public readingReceived(readings: GrowPiReading[]): void {
    console.log(JSON.stringify(readings, null, 2));
    readings.forEach((reading) => {
      const query =
        "INSERT INTO Readings (UTCTime, Lux, IR, FullLux, Temperature, Moisture, Relays) \
        VALUES (@UTCTime, @Lux, @IR, @FullLux, @Temperature, @Moisture, @Relays);";
      const request = new Request(query, (error) => {
        if (error) {
          console.error(error);
        }
      });
      request.addParameter("UTCTime", TYPES.BigInt, reading.reading.time);
      request.addParameter("Lux", TYPES.Int, reading.reading.lux.lux);
      request.addParameter("IR", TYPES.Int, reading.reading.lux.ir);
      request.addParameter("FullLux", TYPES.Int, reading.reading.lux.full);
      request.addParameter("Temperature", TYPES.Float, reading.reading.temperature);
      request.addParameter("Moisture", TYPES.Int, reading.reading.moisture);
      request.addParameter("Relays", TYPES.TinyInt, reading.reading.relays);
      this.connection.execSql(request);
    });
  }

  public error(error: Error): void {
    console.log(error);
  }
}

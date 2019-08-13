export interface ILuxReading {
  ir: number;
  full: number;
  lux: number;
}

export interface IGrowPiReading {
  time: number;
  lux: ILuxReading;
  temperature: number;
  moisture: number;
  relays: number;
}

export class GrowPiReading {
  public reading: IGrowPiReading;

  constructor(
    time: number, ir: number, full: number, lux: number, temperature: number, moisture: number, relays: number) {
    this.reading = { time, lux: { ir, full, lux }, temperature, moisture, relays };
  }
}

export default GrowPiReading;

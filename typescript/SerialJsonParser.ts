import GrowPiReading from "./growpi-reading";

export class SerialJsonParser {
  public static extractReading(text: string): GrowPiReading[] {
    const readings: GrowPiReading[] = [];
    let beginningIndex = -1;
    let bracketCount = 0;
    for (let i = 0; i < text.length; i++) {
      if (text.charAt(i) === "{") {
        if (beginningIndex === -1) {
          beginningIndex = i;
        }
        bracketCount++;
      } else if (text.charAt(i) === "}") {
        bracketCount--;
      }

      if (bracketCount === 0 && beginningIndex !== -1) {
        const json = text.substring(beginningIndex, i + 1);
        try {
          const jsonObj = JSON.parse(json);
          readings.push(new GrowPiReading(
            Date.now(),
            jsonObj.LUX.IR,
            jsonObj.LUX.FULL,
            jsonObj.LUX.LUX,
            jsonObj.TEMP,
            jsonObj.MOISTURE,
            jsonObj.RELAYS));
        } catch (error) {
          // Do nothing
        }
        beginningIndex = -1;
      }
    }

    return readings;
  }
}

export default SerialJsonParser;

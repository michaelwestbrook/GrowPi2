import { Sender, ServiceBusClient } from "@azure/service-bus";
import { IGrowPiListener } from "./arduino-communicator";
import GrowPiReading from "./growpi-reading";

export class ServiceBusListener implements IGrowPiListener {
  private sender: Sender;
  constructor(connectionString: string) {
    const serviceClient = ServiceBusClient.createFromConnectionString(connectionString);
    const queueClient = serviceClient.createQueueClient("growpi");
    this.sender = queueClient.createSender();
  }

  public readingReceived(readings: GrowPiReading[]) {
    readings.forEach((reading) => {
      console.debug(JSON.stringify(reading, null, 2));
      this.sender.send({
        body: reading,
      });
    });
  }

  public error(error: Error) {
    console.error(error);
  }
}

export default ServiceBusListener;

import { AMQPClient } from "@cloudamqp/amqp-client";
import dotenv from "dotenv";

dotenv.config();

const cloudAMQPURL = process.env.CLOUD_AMQP_URL;
const QUEUE = "vortex";

const startProducer = async () => {
  try {
    const connection = new AMQPClient(cloudAMQPURL);
    await connection.connect();
    const channel = await connection.channel();

    console.log("[✅] Connection over channel established");

    await channel.queue(QUEUE, { durable: false });

    //Publish a message to the exchange
    async function sendToQueue(routingKey, body) {
      await channel.basicPublish("", routingKey, body);
      console.log("[📥] Message sent to queue", body);
    }

    sendToQueue(QUEUE, "Hello World1");
    sendToQueue(QUEUE, "Hello World2");
    sendToQueue("wrong_routing_key", "Hello World3");

    setTimeout(() => {
      //Close the connection
      connection.close();
      console.log("[❎] Connection closed");
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
    //Retry after 3 second
    setTimeout(() => {
      startProducer();
    }, 3000);
  }
};

export default startProducer;

import { AMQPClient } from "@cloudamqp/amqp-client";
import dotenv from "dotenv";

dotenv.config();
const cloudAMQPURL = process.env.CLOUD_AMQP_URL;
const QUEUE = "slack_notification";

const sendNotification = async () => {
  try {
    const connection = new AMQPClient(cloudAMQPURL);
    await connection.connect();
    const channel = await connection.channel();

    console.log("[✅] Connection over channel established");

    // Declare the exchange
    await channel.exchangeDeclare("slack_exchange", { durable: true });

    // Declare and bind queues
    await channel.queueDeclare("hr_queue", { durable: true });
    await channel.queueBind("hr_queue", "slack_exchange", "hr");

    await channel.queueDeclare("marketing_queue", { durable: true });
    await channel.queueBind("marketing_queue", "slack_exchange", "marketing");

    await channel.queueDeclare("support_queue", { durable: true });
    await channel.queueBind("support_queue", "slack_exchange", "support");

    console.log("Messaging infrastructure set up successfully.");

    // Close the connection when everything is set up
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error(error);
  }
};

export default sendNotification;

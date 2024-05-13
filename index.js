import express from "express";
import dotenv from "dotenv";
import startConsumer from "./amqp_consumer.js";
import startProducer from "./amqp_producer.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Server is running!");
});

startProducer();
startConsumer();

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}/`)
);

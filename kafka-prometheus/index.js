'use strict';

const { Kafka } = require('kafkajs');
const express = require('express');
const { register, collectDefaultMetrics } = require('prom-client');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'], // Replace with your Kafka broker(s) information
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'my-group' });

const app = express();
const port = 3000;

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

async function runConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'topic' }); // Replace with your Kafka topic

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      // Handle Kafka messages
    },
  });
}

async function runProducer() {
  await producer.connect();

  setInterval(async () => {
    await producer.send({
      topic: 'topic', // Replace with your Kafka topic
      messages: [{ value: 'Kafka message from producer' }],
    });
  }, 1000);
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Start Prometheus metrics collection
collectDefaultMetrics({ timeout: 5000 });

runConsumer().catch((err) => {
  console.error(`Error in Kafka consumer: ${err}`);
});

runProducer().catch((err) => {
  console.error(`Error in Kafka producer: ${err}`);
});

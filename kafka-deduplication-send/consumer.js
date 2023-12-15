'use strict';

const { Kafka, logLevel } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-producer',
  brokers: ['localhost:9092'],
  logLevel: logLevel.ERROR, // Adjust the log level as needed
});

const consumer = kafka.consumer({ groupId: 'test-group' });

(async () => {
  try {
    await consumer.subscribe({ topic: 'deduplication', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
        console.log({
          key: message.key.toString(),
          value: message.value.toString(),
          headers: message.headers,
        })
      },
    })
  } catch (err) {
    console.error(err);
  }
})();

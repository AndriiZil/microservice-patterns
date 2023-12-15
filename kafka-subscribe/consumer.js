'use strict';

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'consumer-service',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({
  groupId: 'example-consumer',
});

(async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'idempotent', fromBeginning: true });

  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message: ${message.value.toString()} from topic ${topic}`);
    },
  });
})();

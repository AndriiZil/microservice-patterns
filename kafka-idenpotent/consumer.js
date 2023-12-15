'use strict';

const { Kafka } = require('kafkajs');
const kafka = new Kafka({
  clientId: 'transaction-service',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({
  groupId: 'example-consumer',
  maxBytesPerPartition: 1024, // Adjust this based on your message size
});

(async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message: ${message.value.toString()} from topic ${topic}`);

      const { value, offset } = message;
      console.log(`Received message: ${value} at offset ${offset}`);

      await consumer.commitOffsets([{ topic, partition, offset }]);
    },
  });
})();

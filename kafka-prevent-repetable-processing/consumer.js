'use strict';

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'transaction-service',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({
  groupId: 'consumer',
});

(async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'events', fromBeginning: true });

    await consumer.run({
      autoCommit: true,
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`Received message: ${message.value.toString()} from topic ${topic}`);

        const { value, offset } = message;
        console.log(`Received message: "${value}" at offset "${offset}"`);

        // Process the message here

        // Commit the offset to Kafka to mark the message as processed in order to prevent after restart
        // await consumer.commitOffsets([{ topic, partition, offset: offset + 1 }]);
      },
    });
  } catch (err) {
    console.error(err);
  }
})();

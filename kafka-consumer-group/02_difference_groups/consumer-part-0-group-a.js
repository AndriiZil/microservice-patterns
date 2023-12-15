'use strict';

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
});

(async () => {
  try {
    const consumer = kafka.consumer({ groupId: 'my-group-a' });

    await consumer.connect()
    await consumer.subscribe({ topic: 'my-topic', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topic,
          partition,
          value: message.value.toString(),
        })
      },
    });
  } catch (err) {
    console.error(err);
  }
})();

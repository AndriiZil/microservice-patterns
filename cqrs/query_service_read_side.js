'use strict';

const { Kafka, Partitioners } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['127.0.0.1:9092']
});

const consumer = kafka.consumer({ groupId: 'test-group2' });
const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

const readModel = {};

(async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'events', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const event = JSON.parse(message.value);

        console.log('Received event:', event);

        // Apply the event to the read model
        if (event.eventType === 'ItemCreated') {
          readModel[event.itemId] = { id: event.itemId, name: event.itemName };
        }

        console.info('Updated read model:', readModel);
      },
    });
  } catch (err) {
    console.error(err);
  }
})();

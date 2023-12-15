'use strict';

const { Kafka, Partitioners } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['127.0.0.1:9092']
});

const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

(async () => {
  try {
    await producer.connect();
    await producer.send({
      topic: 'commands',
      messages: [
        {
          value: JSON.stringify({
            commandType: 'CreateItem',
            itemId: 'item1',
            itemName: 'Item 1',
          })
        },
      ],
    });

    await producer.disconnect();
  } catch (err) {
    console.error(err);
  }
})();

'use strict';

const { Kafka, Partitioners } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['127.0.0.1:9092']
});

const consumer = kafka.consumer({ groupId: 'test-group' });
const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

(async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'commands', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const command = JSON.parse(message.value);

        // Process the command and generate events
        if (command.commandType === 'CreateItem') {
          const event = {
            eventType: 'ItemCreated',
            itemId: command.itemId,
            itemName: command.itemName,
          };

          console.log(command);

          await producer.connect();
          await producer.send({
            topic: 'events',
            messages: [
              {
                value: JSON.stringify(event),
              }
            ]
          });

          await producer.disconnect();
        }
      },
    });
  } catch (err) {
    console.error(err);
  }
})();

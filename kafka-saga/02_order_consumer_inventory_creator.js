'use strict';

const {Kafka, Partitioners} = require('kafkajs');
const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['localhost:9092'],
});

const orderTopic = 'orders';
const inventoryTopic = 'inventory';

const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
const consumer = kafka.consumer({ groupId: 'order-consumer-group' });

(async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: orderTopic });

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        const [action, orderId] = message.value.toString().split('|');

        console.log(`Received "${action}" request for order "${orderId}" on topic "${topic}"`);

        if (action === 'order') {
          // Step 1: Send request for inventory checking
          await producer.connect();

          await producer.send({
            topic: inventoryTopic,
            messages: [{ value: `inventory|${orderId}` }],
          });

          console.info(`Request to "order-inventory-service" with orderId "${orderId}" send`);

          await producer.disconnect();
        }
      },
    });
  } catch (err) {
    console.error(err);
  }
})();

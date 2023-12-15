'use strict';


const { Kafka, Partitioners} = require('kafkajs');
const kafka = new Kafka({
  clientId: 'order-inventory-service',
  brokers: ['localhost:9092'],
});

const inventoryTopic = 'inventory';
const shippingTopic = 'shipping';

const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
const consumer = kafka.consumer({ groupId: 'order-inventory-group' });

(async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: inventoryTopic });

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        const [action, orderId] = message.value.toString().split('|');

        console.log(`Received "${action}" request for order "${orderId}" on topic "${topic}"`);

        if (action === 'inventory') {
          // Step 2: Checking inventory
          await producer.connect();

          await producer.send({
            topic: shippingTopic,
            messages: [{ value: `shipping|${orderId}` }],
          });

          console.info(`Request to "order-shipping-service" with orderId "${orderId}" send`);

          await producer.disconnect();
        }
      },
    });
  } catch (err) {
    console.error(err);
  }
})();

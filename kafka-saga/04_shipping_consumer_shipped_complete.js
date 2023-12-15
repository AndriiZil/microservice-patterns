'use strict';


const { Kafka } = require('kafkajs');
const kafka = new Kafka({
  clientId: 'order-shipping-service',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'order-shipping-group' });

const shippingTopic = 'shipping';

(async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: shippingTopic });

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        const [action, orderId] = message.value.toString().split('|');
        console.log(`Received "${action}" request for order "${orderId}" on topic "${topic}"`);

        if (action === 'shipping') {
          // Step 3: Shipping Complete
          console.log(`OrderId: "${orderId}" complete shipping.`);
        }
      },
    });
  } catch (err) {
    console.error(err);
  }
})();

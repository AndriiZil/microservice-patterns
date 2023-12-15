'use strict';

const { Kafka, Partitioners } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'order-fulfillment-service',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
const consumer = kafka.consumer({ groupId: 'order-fulfillment-group' });

const orderTopic = 'orders';
const paymentTopic = 'payments';
const inventoryTopic = 'inventory';
const shippingTopic = 'shipping';

(async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: orderTopic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const [orderId, action] = message.value.toString().split('|');
      console.log(`Received "${action}" request for order "${orderId}" on topic "${topic}"`);

      if (action === 'PlaceOrder') {
        // Step 1: Payment Processing
        await producer.send({
          topic: paymentTopic,
          messages: [{ value: `ProcessPayment|${orderId}` }],
        });
      } else if (action === 'PaymentProcessed') {
        // Step 2: Inventory Check
        await producer.send({
          topic: inventoryTopic,
          messages: [{ value: `CheckInventory|${orderId}` }],
        });
      } else if (action === 'InventoryChecked') {
        // Step 3: Shipping
        await producer.send({
          topic: shippingTopic,
          messages: [{ value: `ShipOrder|${orderId}` }],
        });
      } else if (action === 'OrderShipped') {
        // Step 4: Order Completion
        console.log(`Order ${orderId} is complete.`);
      }
    },
  });
})();

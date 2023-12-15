'use strict';

const { Kafka, Partitioners } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'order-fulfillment-service',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

const orderTopic = 'orders';

// Simulate order placement by triggering the saga with an order ID
const placeOrder = async (orderId) => {
  await producer.connect();

  await producer.send({
    topic: orderTopic,
    messages: [{ value: `PlaceOrder|${orderId}` }],
  });

  await producer.disconnect();
};

// Simulate order placement
placeOrder('12345').catch(console.error);

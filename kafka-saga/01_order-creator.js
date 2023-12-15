'use strict';


const { Kafka, Partitioners} = require('kafkajs');
const kafka = new Kafka({
  clientId: 'order-producer-service',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

const orderTopic = 'orders';
const orderId = (Math.random() * 1000000).toFixed(0);

(async () => {
  try {
    await producer.connect();

    await producer.send({
      topic: orderTopic,
      messages: [
        {
          value: `order|${orderId}`
        },
      ],
    });

    console.info(`Request to "order-service" with orderId "${orderId}" send`);

    await producer.disconnect();
  } catch (err) {
    console.error(err);
  }
})();

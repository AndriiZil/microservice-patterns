'use strict';

const { Kafka, Partitioners } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'transaction-service',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
  idempotent: true,
  maxInFlightRequests: 1,
  retry: 3,
});

(async () => {
  try {
    await producer.connect();

    await producer.send({
      topic: 'events',
      acks: -1,
      messages: [
        { key: 'same', value: 'some' },
        { key: 'same', value: 'some' },
        { key: 'same', value: 'some' },
      ]
    });

    await producer.disconnect();
  } catch (err) {
    console.error(err);
  }
})();

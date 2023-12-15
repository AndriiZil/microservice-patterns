'use strict';

const { Kafka, Partitioners } = require('kafkajs');
const kafka = new Kafka({
  clientId: 'transaction-service',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer({
  transactionalId: 'my-transactional-producer',
  maxInFlightRequests: 1,
  idempotent: true,
  createPartitioner: Partitioners.LegacyPartitioner,
});

(async () => {
  await producer.connect();

  const transaction = await producer.transaction();

  try {
    await transaction.send({
      topic: 'events',
      acks: -1,
      messages: [
        { key: 'key1', value: 'message 12' },
      ]
    });

    await transaction.send({
      topic: 'events',
      acks: -1,
      messages: [
        { key: 'key1', value: 'message 12' },
      ]
    });

    await transaction.commit();
  } catch (err) {
    console.error(err);
    await transaction.abort();
  } finally {
    await producer.disconnect();
  }
})();

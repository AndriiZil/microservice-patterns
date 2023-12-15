'use strict';

const { Kafka, Partitioners, logLevel} = require('kafkajs')
const WinstonLogCreator = require('./logger');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
  logLevel: logLevel.ERROR,
  logCreator: WinstonLogCreator,
});

const producer = kafka.producer({
  idempotent: true,
  maxInFlightRequests: 1,
  allowAutoTopicCreation: true,
  transactionalId: 'transaction',
  createPartitioner: Partitioners.LegacyPartitioner,
});

(async () => {
  const topicMessages = [
    {
      topic: 'topic-a',
      messages: [{ key: 'key', value: 'hello topic-a' }],
    },
    {
      topic: 'topic-b',
      messages: [{ key: 'key', value: 'hello topic-b' }],
    }
  ];
  await producer.connect();
  const transaction = await producer.transaction();

  try {
    await transaction.sendBatch({
      acks: -1,
      topicMessages
    });

    producer.logger().info('Send');
    await transaction.commit();
  } catch (e) {
    await transaction.abort();
  } finally {
    await producer.disconnect();
  }
})();

'use strict';

const { Kafka, logLevel } = require('kafkajs')
const WinstonLogCreator = require('./logger');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
  logLevel: logLevel.ERROR,
  logCreator: WinstonLogCreator,
});

const consumer = kafka.consumer({ groupId: 'my-group2', allowAutoTopicCreation: true });

(async () => {
  try {
    await consumer.subscribe({ topics: ['topic-a'], fromBeginning: true });

    await consumer.run({
      autoCommit: true,
      eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
        console.log({
          key: message.key.toString(),
          value: message.value.toString(),
          headers: message.headers,
        })
      },
    });

    consumer.logger().info('Receive');
  } catch (err) {
    console.error(err);
  }
})();

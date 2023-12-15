'use strict';

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});

const admin = kafka.admin();

(async () => {
  try {
    await admin.connect();

    console.log(await admin.listTopics());

    await admin.createTopics({
      topics: [
        {
          topic: 'topic-a',
          numPartitions: 1,
        },
        {
          topic: 'topic-a',
          numPartitions: 1,
        }
      ]
    });

    await admin.disconnect();
  } catch (err) {
    console.error(err);
  }
})();

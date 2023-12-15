'use strict';

const { Kafka, Partitioners} = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
});

(async () => {
  try {
    const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

    await producer.connect();
    await producer.send({
      topic: 'test-group',
      messages: [
        { value: 'Hello KafkaJS from partition 0', partition: 0 },
        { value: 'Hello KafkaJS from partition 1', partition: 1 },
        { value: 'Hello KafkaJS from partition 2', partition: 2 },
      ],
    });

    await producer.disconnect();
  } catch (err) {
    console.error(err);
  }
})();

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
      topic: 'my-topic',
      messages: [
        { value: 'Hello KafkaJS from partition 0', partition: 0 },
        { value: 'Hello KafkaJS from partition 1', partition: 1 },
      ],
    });

    await producer.disconnect();
  } catch (err) {
    console.error(err);
  }
})();

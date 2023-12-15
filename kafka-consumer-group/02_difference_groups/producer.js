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
        { value: 'Hello KafkaJS difference groups', partition: 0 }
      ],
    });

    await producer.disconnect();
  } catch (err) {
    console.error(err);
  }
})();

'use strict';

const kafka = require('kafka-node');
const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });

const consumer = new Consumer(client, [
  { topic: 'topic', partition: 0 }
], {
  groupId: 'your_consumer_group',
  autoOffset: 'earliest', // Start consuming from the beginning of the topic
});

consumer.on('message', (message) => {
  console.log(`Received message: ${message.value}`);
});

consumer.on('error', (err) => {
  console.error(`Consumer error: ${err}`);
});

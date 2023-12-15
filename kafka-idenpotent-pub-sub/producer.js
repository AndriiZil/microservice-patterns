'use strict';

const kafka = require('kafka-node');
const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });

const producer = new Producer(client);

producer.on('ready', () => {
  console.log('Producer is ready to send messages.');

  const payloads = [
    { topic: 'topic', messages: 'Message 1' },
    { topic: 'topic', messages: 'Message 2' },
    { topic: 'topic', messages: 'Message 3' },
  ];

  producer.send(payloads, (err, data) => {
    if (err) {
      console.error(`Error sending message: ${err}`);
    } else {
      console.log(`Messages sent successfully: ${JSON.stringify(data)}`);
    }
  });
});

producer.on('error', (err) => {
  console.error(`Producer error: ${err}`);
});

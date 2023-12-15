'use strict';

const { setTimeout } = require('node:timers/promises');
const express = require('express');
const { Kafka, Partitioners} = require('kafkajs');

const app = express();

const kafka = new Kafka({
  clientId: 'producer-service',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer({
  allowAutoTopicCreation: 'idempotent',
  idempotent: true,
  maxInFlightRequests: 1,
  createPartitioner: Partitioners.LegacyPartitioner
});

app.get('/send', async (req, res) => {
  try {
    await producer.connect();

    await producer.send({
      topic: 'idempotent',
      acks: -1,
      messages: [
        {
          key: '1',
          value: 'Message',
          partition: 0
        },
      ],
    });

    await producer.send({
      topic: 'idempotent',
      acks: -1,
      messages: [
        {
          key: '1',
          value: 'Message',
          partition: 0
        },
      ],
    });

    await producer.send({
      topic: 'idempotent',
      acks: -1,
      messages: [
        {
          key: '1',
          value: 'message-1',
          partition: 0
        },
        {
          key: '1',
          value: 'message-2',
          partition: 0
        },
      ],
    });

    return res.send({ message: 'ok' });
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, () => console.log('server started'));

// (async () => {
//   try {
//     await producer.connect();
//
//     await producer.send({
//       topic: 'idempotent',
//       acks: -1,
//       messages: [
//         {
//           key: 'key',
//           value: 'Message',
//           partition: 0
//         },
//       ],
//     });
//
//     await producer.send({
//       topic: 'idempotent',
//       acks: -1,
//       messages: [
//         {
//           key: 'key',
//           value: 'Message',
//           partition: 0
//         },
//       ],
//     });
//
//     await producer.send({
//       topic: 'idempotent',
//       acks: -1,
//       messages: [
//         {
//           key: 'key',
//           value: 'Message',
//           partition: 0
//         },
//       ],
//     });
//
//     // await producer.disconnect();
//   } catch (err) {
//     console.error(err);
//   }
// })();

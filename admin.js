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

    // await admin.createTopics({
    //   topics: [
    //     {
    //       topic: 'orders',
    //       numPartitions: 1,
    //     },
    //     {
    //       topic: 'inventory',
    //       numPartitions: 1,
    //     },
    //     {
    //       topic: 'payments',
    //       numPartitions: 1,
    //     },
    //     {
    //       topic: 'shipping',
    //       numPartitions: 1,
    //     },
    //     {
    //       topic: 'test',
    //       numPartitions: 1
    //     }
    //   ]
    // });

    await admin.createTopics({
      topics: [
        {
          topic: 'deduplication',
          numPartitions: 1,
        }
      ]
    });

    // console.log(await admin.listTopics());

    // await admin.deleteTopics({
    //   topics: ['inventory', 'payments', 'event', 'orders', 'commands', 'events', 'shipping'],
    // });

    const metadata = await admin.fetchTopicMetadata({topics: ['test']});
    console.log(JSON.stringify(metadata, null, 2));

    await admin.disconnect();
  } catch (err) {
    console.error(err);
  }
})();

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-kafka-streams-app',
  brokers: ['localhost:9092'],
});

console.log(kafka);

const stream = kafka.stream();

const streamTopology = () => {
  stream
    .from('input-topic')
    .mapValues((value) => {
      // Your stream processing logic here
      return value.toUpperCase(); // Example: Convert the value to uppercase
    })
    .to('output-topic');
};

const runStream = async () => {
  const admin = kafka.admin();
  await admin.connect();
  await admin.createTopics({
    topics: [{ topic: 'input-topic', numPartitions: 1 }],
  });
  await admin.disconnect();

  const producer = kafka.producer();
  await producer.connect();

  // Produce some messages to the input topic
  await producer.send({
    topic: 'input-topic',
    messages: [
      { value: 'message 1' },
      { value: 'message 2' },
    ],
  });

  await producer.disconnect();

  const consumer = kafka.consumer({ groupId: 'my-group' });
  await consumer.connect();

  // Subscribe to the output topic to consume processed messages
  await consumer.subscribe({ topic: 'output-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        key: message.key.toString(),
        value: message.value.toString(),
      });
    },
  });
};

streamTopology(); // Define the Kafka Streams topology
runStream(); // Run the Kafka Streams application

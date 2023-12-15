const { Kafka, CompressionTypes, logLevel } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-producer',
  brokers: ['localhost:9092'],
  logLevel: logLevel.ERROR, // Adjust the log level as needed
});

const producer = kafka.producer();

const sendMessage = async (key, value) => {
  await producer.connect();

  await producer.send({
    topic: 'deduplication',
    compression: CompressionTypes.GZIP,
    messages: [
      {
        key: key,  // Use a unique key for each message
        value: value,
      },
    ],
  });
  console.log('SEND');
};

const deduplicationCache = new Set();

const sendMessageWithDeduplication = async (key, value) => {
  if (!deduplicationCache.has(key)) {
    console.log('BEFORE');
    deduplicationCache.add(key);

    try {
      await sendMessage(key, value);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    // Optionally, set a timeout to remove the key from the cache after a certain time.
    setTimeout(() => {
      console.info('cache cleaned.');
      deduplicationCache.delete(key);
    }, 60000); // Remove after 1 minute
  }
};

// Usage
sendMessageWithDeduplication('unique-key-simple', 'Message content 1').catch(console.error);
sendMessageWithDeduplication('unique-key-simple', 'Message content 1').catch(console.error);

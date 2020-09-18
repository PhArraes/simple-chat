const ip = require('ip')

const { Kafka, CompressionTypes, logLevel } = require('kafkajs')

const host = process.env.HOST_IP || ip.address()

console.log(host)
const kafka = new Kafka({
  logLevel: logLevel.DEBUG,
  brokers: [`${host}:9092`],
  clientId: 'chat-producer',
})

const topic = 'topic-chat'
const producer = kafka.producer()

const createMessage = (key, message) => ({
  key: key,
  value: message,
})

const sendMessage = (key, message) => {
  return producer
    .send({
      topic,
      compression: CompressionTypes.GZIP,
      messages: Array(1)
        .fill()
        .map(_ => createMessage(key, message)),
    })
    .then(console.log)
    .catch(e => console.error(`[chat/producer] ${e.message}`, e))
}

const run = async () => {
  await producer.connect()
  //setInterval(sendMessage, 3000)
}

run().catch(e => console.error(`[chat/producer] ${e.message}`, e))

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.map(type => {
  process.on(type, async () => {
    try {
      console.log(`process.on ${type}`)
      await producer.disconnect()
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
})

signalTraps.map(type => {
  process.once(type, async () => {
    try {
      await producer.disconnect()
    } finally {
      process.kill(process.pid, type)
    }
  })
})


module.exports = {sendMessage};
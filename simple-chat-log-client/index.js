const ip = require('ip')
const db = require('./db')

const { Kafka, logLevel } = require('kafkajs')

const host = process.env.HOST_IP || ip.address()

const getRandomNumber = () => Math.round(Math.random(10) * 1000)

const kafka = new Kafka({
  logLevel: logLevel.INFO,
  brokers: [`${host}:9092`],
  clientId: `chat-consumer-${getRandomNumber()}`,
})

const topic = 'topic-chat'
const consumer = kafka.consumer({ groupId: `test-group-${getRandomNumber()}` })


const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: true })
  await consumer.run({
    // eachBatch: async ({ batch }) => {
    //   console.log(batch)
    // },
    eachMessage: async ({ topic, partition, message }) => {
     console.log( await db.insertMessage({
        topic: topic, partition, timestamp : message.timestamp, key : message.key, value: `${message.value}`
      }));
    },
  })
}

run().catch(e => console.error(`[example/consumer] ${e.message}`, e))

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.map(type => {
  process.on(type, async e => {
    try {
      console.log(`process.on ${type}`)
      console.error(e)
      await consumer.disconnect()
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
})

signalTraps.map(type => {
  process.once(type, async () => {
    try {
      await consumer.disconnect()
    } finally {
      process.kill(process.pid, type)
    }
  })
})
const
  { QUEUE_NAME, AMQP_HOST } = require('../config'),
  amqp = require('amqplib'),
  logger = require('./logger'),
  api = require('./api'),
  handler = require('./handler')

async function start () {
  logger.info('Start worker processing incoming updates')

  const conn = await amqp.connect(`amqp://${AMQP_HOST}`);
  logger.log('Successfully connection to RabbitMQ')

  const channel = await conn.createChannel()
  await channel.assertQueue(QUEUE_NAME)
  logger.info('Connect to queue: %s', QUEUE_NAME)

  channel.consume(QUEUE_NAME, async (msg) => {
    const lifeBackend = await api.checkLife()
    if (typeof lifeBackend === 'boolean' && lifeBackend) {
      await handler(JSON.parse(msg))
      channel.ack(msg)
    }
  })
}

start()

const
  { TG_TOKEN, NODE_ENV, QUEUE_NAME, AMQP_HOST} = require('../config'),
  axios = require('axios'),
  amqp = require('amqplib'),
  logger = require('./logger')


const telegramApi = axios.create({
  baseURL: `https://api.telegram.org/bot${TG_TOKEN}`
})

async function longPoll(channelAmqp, lastUpdateId = 0) {
  try {
    const response = await telegramApi.get(`/getUpdates?timeout=${NODE_ENV === 'production' ? 5 : 0}${lastUpdateId ? `&offset=${lastUpdateId}` : ''}`)
    const updates = response.data.result
    const localUpdateId = updates.length > 0 ? updates[updates.length - 1].update_id + 1 : lastUpdateId

    updates.map(u => {
      console.log(JSON.stringify(u))
      // channelAmqp.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(u)))
    })

    setTimeout(() => longPoll(channelAmqp, localUpdateId), NODE_ENV === 'production' ? 200 : 1000)
  } catch (e) {
    logger.error(e)
    logger.info('The repeated request will be processed in 60 seconds')

    setTimeout(() => longPoll(channelAmqp, lastUpdateId), 60000)
  }
}


async function start () {
  logger.info('Start worker requesting updates')

  const conn = await amqp.connect(`amqp://${AMQP_HOST}`);
  logger.log('Successfully connection to RabbitMQ')

  const channel = await conn.createChannel()
  await channel.assertQueue(QUEUE_NAME)
  logger.info('Connect to queue: %s', QUEUE_NAME)

  logger.info('Start longpoll get updates')
  longPoll(channel)

}

start()

const express = require('express')

const telegramApi = require('./src/telegramApi')
const router = require('./src/router')

const handleUpdate = require('./src/handleUpdate')
const {checkEnvs} = require('./config')

console.log(process.env)

const app = express()

app.use(express.json())
app.use('/bot-api', router)

function longPollUpdate(offset = null) {
  telegramApi.getNewUpdates(offset).then((data) => {
    const nextOffset = data.length > 0 ? data[data.length - 1].update_id + 1 : offset

    // console.log(data.length)

    data.forEach((obj) => {
      if ('message' in obj) {
        handleUpdate(obj.message)
      }
    })

    setTimeout(() => longPollUpdate(nextOffset), 5000)
  }).catch((e) => {
    throw new Error(e)
  })
}

if (!checkEnvs()) {
  throw new Error('Not found env variables')
}

app.listen(3000, () => {
  longPollUpdate()
  console.log('listen on 3000')
})

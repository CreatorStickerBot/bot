const express = require('express')
const cors = require('cors')

const telegramApi = require('./src/telegramApi')
const api = require('./src/api')
const router = require('./src/router')

const handleUpdate = require('./src/handleUpdate')
const {checkEnvs, PORT} = require('./config/config')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/bot-api', router)

async function longPollUpdate(offset = null, prevErr = false) {
  try {
    await api.checkLife()
    const data = await telegramApi.getNewUpdates(offset)

    const nextOffset = data.length > 0 ? data[data.length - 1].update_id + 1 : offset

    for await (const obj of data) {
      if ('message' in obj) {
        await handleUpdate(obj.message)
      }
    }

    if (prevErr)
      console.log('[SERVER INFORMATION]: server operation has been restored\n-----------------------------------------')
    setTimeout(() => longPollUpdate(nextOffset, false), 1000)

  } catch (err) {
    const localErr = `[ERR SERVER LIFE]: ${err.code || true}. [ERR SERVER STATUS]: ${err.response?.status || undefined}`

    if (localErr !== prevErr) {
      prevErr = localErr
      console.log(prevErr)
      console.log(`[ERR MESSAGE]________`)
      console.log(JSON.stringify(err))
      console.log('-------------------------------------------')
    }

    setTimeout(() => longPollUpdate(offset, prevErr), 10000)
  }
}

if (!checkEnvs()) {
  throw new Error('Not found env variables')
}

app.listen(PORT, '0.0.0.0', () => {
  longPollUpdate()
  console.log(`listen on 0.0.0.0:${PORT}`)
})

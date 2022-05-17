const axios = require('axios')

const { VM_HOST, BACKEND_PORT } = require('../../config')

const baseURL = `http://${VM_HOST}:${BACKEND_PORT}/api/handler-update`

const instance = axios.create({ baseURL })

const api = {
  async checkLife () {
    return await instance.get('/check-life').then(res => res.status === 204)
  },

  async saveMessage (msg) {
    return await instance.post('/save-message', { msg })
  },

  async registrationUser (username, telegramId) {
    return await instance.post('/registration', { username, telegramId }).then(res => res.status === 204)
  }
}

module.exports = api

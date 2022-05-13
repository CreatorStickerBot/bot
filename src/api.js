const axios = require('axios')
const { BACKEND_API_URL } = require('../config/config')
const { confirmed: confirmedError, notFoundUser } = require('./consts/keyErrorsMessage')

const backendApi = axios.create({ baseURL: BACKEND_API_URL })

const api = {
  getConfirmationCode (username, telegramId) {
    return new Promise((resolve, reject) => {
      backendApi.post('/bot/confirmation-code', { username, telegramId }).then(res => {
        const { code, confirmed } = res.data
        if (!code && confirmed) {
          reject(confirmedError)
        }
        if (code && !confirmed) {
          resolve(code)
        }
      }).catch(err => {
        if (err.response.status === 404) {
          reject(notFoundUser)
        }
      })
    })
  },
  confirmationRequest (authStr) {
    return new Promise((resolve, reject) => {
      backendApi.get('/bot/auth/confirmation-request', {
        headers: { Authorization: authStr }
      }).then(resolve).catch(reject)
    })
  },
  saveMessage (message) {
    return new Promise((resolve, reject) => {
      backendApi.post('/bot/save-message', { message: JSON.stringify(message) })
        .then(resolve)
        .catch(reject)
    })
  },
  confirmationActions (telegramId) {
    return new Promise((resolve, reject) => {
      backendApi.post('/bot/confirmation-actions', { telegramId })
        .then(() => resolve(true))
        .catch(() => resolve(false))
    })
  },
  checkLife () {
    return new Promise((resolve, reject) => {
      backendApi.get('/bot/check-life')
        .then(resolve)
        .catch(reject)
    })
  }
}

module.exports = api

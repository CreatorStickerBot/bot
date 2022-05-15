const axios = require('axios')
const { BACKEND_PORT, HOST} = require('../config/config')
const { confirmed: confirmedError, notFoundUser } = require('./consts/keyErrorsMessage')

const backendApi = axios.create({ baseURL: `http://${HOST}:${BACKEND_PORT}/api/bot` })

const api = {
  getConfirmationCode (username, telegramId) {
    return new Promise((resolve, reject) => {
      backendApi.post('/confirmation-code', { username, telegramId }).then(res => {
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
      backendApi.get('/auth/confirmation-request', {
        headers: { Authorization: authStr }
      }).then(resolve).catch(reject)
    })
  },
  saveMessage (message) {
    return new Promise((resolve, reject) => {
      backendApi.post('/save-message', { message: JSON.stringify(message) })
        .then(resolve)
        .catch(reject)
    })
  },
  confirmationActions (telegramId) {
    return new Promise((resolve, reject) => {
      backendApi.post('/confirmation-actions', { telegramId })
        .then(() => resolve(true))
        .catch(() => resolve(false))
    })
  },
  checkLife () {
    return new Promise((resolve, reject) => {
      backendApi.get('/check-life')
        .then(resolve)
        .catch(reject)
    })
  }
}

module.exports = api

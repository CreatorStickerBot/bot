const axios = require('axios')
const { BACKEND_API_URL } = require('../config')

const backendApi = axios.create({ baseURL: BACKEND_API_URL })

const api = {
  sendConfirmedCode(code) {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
}

module.exports = api

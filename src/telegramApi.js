const { BOT_API_URL, FILE_API_URL} = require('../config/config')
const https = require('https')
const axios = require('axios')
const FormData = require('form-data')

const botApi = axios.create({
  baseURL: BOT_API_URL
})

const fileApi = axios.create({
  baseURL: FILE_API_URL
})

const aliasContentTypeImage = {
  'jpg': 'jpeg'
}

const aliasTypes = {
  image: ['png', 'jpg', 'jpeg', 'webp', 'gif']
}

function getType(type) {
  const availableTypes = Object.keys(aliasTypes).filter(key => aliasTypes[key].includes(type))
  if (availableTypes.length === 1) {
    return availableTypes[0]
  }
  return null
}

function arrayToUri(array) {
  return encodeURI(`${array.join(',')}`)
}


const telegramApi = {
  sendMessage (userId, message, parseMode = 'Markdown') {
    return new Promise((resolve, reject) => {
      botApi.get(`/sendMessage?chat_id=${userId}&text=${encodeURI(message)}&parse_mode=${parseMode}`).then((res) => {
        resolve(res.data.result)
      }).catch((e) => {
        reject(e.response.data)
      })
    })
  },
  createStickerSet (userId, name, title, pngFileId, emojis) {
    return new Promise((resolve, reject) => {
      botApi.get(`/createNewStickerSet?user_id=${userId}&name=${name}&title=${title}&png_sticker=${pngFileId}&emojis=${arrayToUri(emojis)}`).then((res) => {
        resolve(res.data.result)
      }).catch((e) => {
        reject(e.response.data)
      })
    })
  },
  addSticker (userId, setName, pngFileId, emojis) {
    return new Promise((resolve, reject) => {
      botApi.get(`/addStickerToSet?user_id=${userId}&name=${setName}&png_sticker=${pngFileId}&emojis=${arrayToUri(emojis)}`).then((res) => {
        resolve(res.data.result)
      }).catch((e) => {
        reject(e.response.data)
      })
    })
  },
  getStickerSet (name) {
    return new Promise((resolve, reject) => {
      botApi.get(`/getStickerSet?name=${name}`).then((res) => {
        resolve(res.data.result)
      }).catch((e) => {
        reject(e.response.data)
      })
    })
  },
  getUserPhotos (telegramId) {
    return new Promise((resolve, reject) => {
      botApi.get(`/getUserProfilePhotos?user_id=${telegramId}`).then((res) => {
        resolve(res.data.result)
      }).catch((e) => {
        reject(e.response.data)
      })
    })
  },
  getFile (fileId) {
    return new Promise((resolve, reject) => {
      botApi.get(`/getFile?file_id=${fileId}`).then((res) => {
        const { file_path } = res.data.result
        let type = file_path.split('.')
        type = type[type.length - 1]
        if (Object.keys(aliasContentTypeImage).includes(type))
          type = aliasContentTypeImage[type]

        const dataType = getType(type)

        telegramApi
          .getThumbFile(file_path)
          .then((data) => {
            let base64 = `data:${dataType}/${type};base64,`
            base64 += Buffer.from(data).toString('base64')
            resolve({
              fileId: fileId,
              file: base64
            })
          })
          .catch(reject)

      }).catch((e) => {
        reject(e.response.data)
      })
    })
  },
  getThumbFile (filePath) {
    return new Promise((resolve, reject) => {
      fileApi.get(`${filePath}`, { responseType: 'arraybuffer' }).then((res) => {
        resolve(res.data)
      }).catch((e) => {
        reject(e.response.data)
      })
    })
  },
  uploadStickerImage (userId, image) {
    const form = new FormData()
    form.append('user_id', userId)
    form.append('png_sticker', image)

    return new Promise((resolve, reject) => {
      botApi.post(`/uploadStickerFile`, form, {
        headers: form.getHeaders()
      }).then((res) => {
        resolve(res.data.result)
      }).catch((e) => {
        reject(e.response.data)
      })
    })
  },
  deleteSticker (fileId) {
    return new Promise((resolve, reject) => {
      botApi.get(`/deleteStickerFromSet?sticker=${fileId}`).then((res) => {
        resolve(res.data.result)
      }).catch((e) => {
        reject(e.response.data)
      })
    })
  },
  getNewUpdates (offset = null) {
    return new Promise((resolve, reject) => {
      botApi.get(`/getUpdates${offset ? `?offset=${offset}` : ''}`).then((res) => {
        resolve(res.data.result)
      }).catch((e) => {
        reject(e)
      })
    })
  }
}

module.exports = telegramApi

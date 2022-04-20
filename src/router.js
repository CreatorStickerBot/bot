const { Router } = require('express')
const multiparty = require('multiparty')
const { rmSync, createReadStream } = require('fs')
const telegramApi = require('./telegramApi')

const router = Router()

router.all('/check-life', (_, res) => {
  res.status(200)
  res.send('ok')
})

/**
 * Routes:
 * /uploadStickerImage
 * /createStickerSet
 * /getStickerSet
 * /addSticker
 * /removeSticker
 * /getProfilePhotos
 */

router.get('/getStickerSet', (req, res) => {
  /**
   * @param {{stickerSetName}} req.body
   */
  if (!req.body.stickerSetName) {
    res.status(400)
    res.json({
      error: 'Bad request',
      message: 'Invalid field {stickerSetName}'
    })
    return;
  }

  telegramApi.getStickerSet(req.body.stickerSetName).then((data) => {
    res.status(200)
    res.json(data)
  }).catch((errorMessage) => {
    res.status(errorMessage.error_code)
    res.send(errorMessage.description)
  })

})

router.get('/getProfilePhotos', (req, res) => {
  /**
   * @param {{userId}} req.body
   */
  if (!req.body.userId) {
    res.status(400)
    res.json({
      error: 'Bad request',
      message: 'Invalid field {userId}'
    })
    return;
  }

  telegramApi.getUserPhotos(req.body.userId).then((data) => {
    const { photos, total_count } = data

    const miniPhotos = photos.map(async photo => {
      const { file_id } = photo[0]
      return await telegramApi.getFile(file_id)
    })

    Promise.all(miniPhotos).then(photos => {
      res.status(200)
      res.send(photos)
    })

  }).catch((errorMessage) => {
    res.status(errorMessage.error_code)
    res.send(errorMessage.description)
  })
})

router.post('/createStickerSet', (req, res) => {
  /**
   * @param {{ userId, title, pngFileId, emojis }} req.body
   */
  // console.log(req)
  const { userId, title, pngFileId, emojis } = req.body

  if (!userId || !title || !pngFileId || !emojis || emojis.length < 1) {
    res.status(400)
    res.json({
      error: 'Bad request',
      message: 'Invalid field one or more of [userId, title, pngFileId, emojis]'
    })
    return;
  }

  const name = title + '_by_creator_stickers_bot'
  telegramApi.createStickerSet(userId, name, title, pngFileId, emojis).then((data) => {
    // if success create? return true
    if (Boolean(data)) {
      res.status(200)
      res.send({ url: `https://t.me/addstickers/${name}`, name, title })
    } else {
      res.status(400)
      res.json({
        error: 'Bad request',
        message: 'Invalid request'
      })
    }
  }).catch((errorMessage) => {
    res.status(errorMessage.error_code)
    res.send(errorMessage.description)
  })
})

router.post('/addSticker', (req, res) => {
  /**
   * @param {{ userId, setName, pngFileId, emojis }} req.body
   */
  const { userId, setName, pngFileId, emojis } = req.body

  if (!userId || !setName || !pngFileId || !emojis || emojis.length < 1) {
    res.status(400)
    res.json({
      error: 'Bad request',
      message: 'Invalid field one or more of [userId, setName, pngFileId, emojis]'
    })
    return;
  }

  telegramApi.addSticker(userId, setName, pngFileId, emojis).then(async (data) => {
    if (Boolean(data)) {
      const image = await telegramApi.getFile(pngFileId)
      res.status(200)
      res.send(image)
    } else {
      res.status(400)
      res.json({
        error: 'Bad request',
        message: 'Invalid request'
      })
    }
  }).catch((errorMessage) => {
    res.status(errorMessage.error_code)
    res.send(errorMessage.description)
  })
})

router.post('/uploadStickerImage', (req, res) => {
  const form = new multiparty.Form()

  form.parse(req, (err, fields, files) => {
    /**
     * @param {{ userId }} fields
     * @param {{ pngSticker }} files
     */
    if ((!fields.userId || !files.pngSticker) || (fields.userId.length < 0 || files.pngSticker.length < 0)) {
      res.status(400)
      res.json({
        error: 'Bad request',
        message: 'Invalid field one or more of [userId, pngSticker]'
      })
      return;
    }

    const userId = fields.userId[0]
    const filePath = files.pngSticker[0].path

    telegramApi.uploadStickerImage(userId, createReadStream(filePath)).then((data) => {
      rmSync(filePath)
      res.status(200)
      res.send(data)
    }).catch((errorMessage) => {
      res.status(errorMessage.error_code)
      res.send(errorMessage.description)
    })
  })
})

router.delete('/removeSticker', (req, res) => {
  /**
   * @param {{ fileId }} req.body
   */
  const { fileId } = req.body
  if (!fileId) {
    res.status(400)
    res.json({
      error: 'Bad request',
      message: 'Invalid field one or more of [userId, setName, pngFileId, emojis]'
    })
    return;
  }

  telegramApi.deleteSticker(fileId).then(async (data) => {
    if (Boolean(data)) {
      res.status(200)
      res.send()
    } else {
      res.status(400)
      res.json({
        error: 'Bad request',
        message: 'Invalid request'
      })
    }
  }).catch((errorMessage) => {
    res.status(errorMessage.error_code)
    res.send(errorMessage.description)
  })
})

module.exports = router

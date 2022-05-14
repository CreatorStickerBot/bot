const { Router } = require('express')
const multiparty = require('multiparty')
const { rmSync, createReadStream } = require('fs')
const telegramApi = require('./telegramApi')
const api = require('./api')

const router = Router()

router.all('/check-life', (_, res) => {
  res.status(200)
  res.send('ok')
})

router.use((req, res, next) => {
  const { authorization } = req.headers
  if (!authorization || !authorization.includes('Bearer ')) {
    res.status(401)
    res.send('No authorization header')
    return;
  }
  api.confirmationRequest(authorization).then(() => {
    next()
  }).catch(err => {
    console.log(err)
    res.status(401)
    res.send(err.response.data)
  })
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

router.get('/sticker-set/:stickerSetTitle', (req, res) => {
  const { stickerSetTitle } = req.params


  if (!stickerSetTitle) {
    res.status(400)
    res.json({
      error: 'Bad request',
      message: 'Invalid param stickerSetTitle'
    })
    return;
  }

  const name = stickerSetTitle + '_by_creator_stickers_bot'

  telegramApi.getStickerSet(name).then(async (data) => {

    Promise.all(
      data.stickers.map(async sticker => {
        const image = await telegramApi.getFile(sticker.file_id)
        return {
          width: sticker.width,
          height: sticker.height,
          emoji: sticker.emoji,
          image,
        }
      }),
    ).then(stickers => {
      res.status(200)
      res.json(stickers)
    }).catch((errorMessage) => {
      res.status(errorMessage.error_code)
      res.send(errorMessage.description)
    })
  }).catch((errorMessage) => {
    res.status(errorMessage.error_code)
    res.send(errorMessage.description)
  })

})

router.get('/profile-photo/:telegramId', (req, res) => {
  if (!req.params.telegramId) {
    res.status(400)
    res.json({
      error: 'Bad request',
      message: 'Invalid params :telegramId'
    })
    return;
  }

  telegramApi.getUserPhotos(req.params.telegramId).then((data) => {
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
   * @param {{ telegramId, title, pngFileId, emojis }} req.body
   */
  // console.log(req)
  const { telegramId, title, pngFileId, emojis } = req.body

  if (!telegramId || !title || !pngFileId || !emojis || emojis.length < 1) {
    res.status(400)
    res.json({
      error: 'Bad request',
      message: 'Invalid field one or more of [telegramId, title, pngFileId, emojis]'
    })
    return;
  }

  const name = title + '_by_creator_stickers_bot'
  telegramApi.createStickerSet(telegramId, name, title, pngFileId, emojis).then((data) => {
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
    if (!errorMessage.error_code) {
      console.log(errorMessage.message, errorMessage.message.includes('join is not a function'))
      if (errorMessage.message.includes('join is not a function')) {
        res.status(400)
        res.send('Invalid request')
      }
    } else {
      res.status(errorMessage.error_code)
      res.send(errorMessage.description)
    }
  })
})

router.post('/addSticker', (req, res) => {
  /**
   * @param {{ userId, setName, pngFileId, emojis }} req.body
   */
  const { telegramId, stickerSetName, pngFileId, emojis } = req.body

  if (!telegramId || !stickerSetName || !pngFileId || !emojis || emojis.length < 1) {
    res.status(400)
    res.json({
      error: 'Bad request',
      message: 'Invalid field one or more of [userId, setName, pngFileId, emojis]'
    })
    return;
  }

  const name = stickerSetName + '_by_creator_stickers_bot'

  telegramApi.addSticker(telegramId, name, pngFileId, emojis).then((data) => {
    if (Boolean(data)) {
      res.sendStatus(200)
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

router.post('/uploadStickerImage/:telegramId', (req, res) => {
  const form = new multiparty.Form()
  const { telegramId } = req.params

  if (!telegramId) {
    res.status(400)
    res.json({
      error: 'Bad request',
      message: 'Invalid param :telegramId'
    })
    return;
  }

  form.parse(req, (err, fields, files) => {
    /**
     * @param {{ pngSticker }} files
     */
    if (!files.pngSticker || files.pngSticker.length < 0) {
      res.status(400)
      res.json({
        error: 'Bad request',
        message: 'Invalid field pngSticker'
      })
      return;
    }

    const filePath = files.pngSticker[0].path

    telegramApi.uploadStickerImage(telegramId, createReadStream(filePath)).then((data) => {
      rmSync(filePath)
      res.status(200)
      res.send(data)
    }).catch((errorMessage) => {
      res.status(errorMessage.error_code)
      res.send(errorMessage.description)
    })
  })
})

router.delete('/sticker-set/:fileId', (req, res) => {
  const { fileId } = req.params
  if (!fileId) {
    res.status(400)
    res.json({
      error: 'Bad request',
      message: 'Invalid field one fileId'
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

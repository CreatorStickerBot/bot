const
  { registrationUser } = require('../api'),
  logger = require('../logger')


module.exports = async function (command, data) {
  const { message: {
    from: { id: telegramId, username }
  } } = data

  const success = await registrationUser(username, telegramId).catch(e => {
    logger.error(e)
    return e
  })

  return typeof success === 'boolean' && success
}

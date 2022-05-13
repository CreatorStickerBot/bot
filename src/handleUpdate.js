const telegramApi = require('./telegramApi')
const api = require('./api')
const {getMessageBotCommand} = require('./utls/handlerUtils')
const keyError = require('./consts/keyErrorsMessage')
const { errorMessages, getRegistrationMessage} = require('./consts/telegramMessages')

const commandList = {
  start: '/start',
  code: '/code'
}

const commandHandlers = {
  /**
   *
   * @param { id, username } user
   */
  [commandList.start]: (user) => {
    api.getConfirmationCode(user.username, user.id).then(code => {
      telegramApi.sendMessage(user.id, getRegistrationMessage(code)).catch(console.log)
    }).catch(err => {
      handleBadCommand(user.id, err)
    })
  },
}

function handleBadCommand (userId, err) {
  telegramApi.sendMessage(userId, errorMessages[err]).catch(console.log)
}

function handleCommand (command, message) {
  const { from: user } = message

  if (command in commandHandlers) {
    commandHandlers[command](user, message.text)
  } else {
    handleBadCommand(user.id, keyError.notFoundCommand)
  }
}

async function handleUpdate (message) {
  const confirmed = await api.confirmationActions(message.from.id)
  if (confirmed) {
    const command = getMessageBotCommand(message)
    if (command) handleCommand(command, message)
  } else {
    handleBadCommand(message.from.id, keyError.notConfirmedUser)
  }

  api.saveMessage(message).catch(err => {
    console.log('[ERROR SERVER]_____________')
    console.log('[ERROR CODE]: ' + err.code)
    console.log('A MESSAGE RECEIVED WHILE THE SERVER WAS UNAVAILABLE:\n' + JSON.stringify(message))
    console.log('---------------------------')
    throw new Error(err)
  })
}

module.exports = handleUpdate

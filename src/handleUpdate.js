const telegramApi = require('./telegramApi')
const api = require('./api')
const {getMessageBotCommand} = require('./utls/handlerUtils')
const { helloMessage, notFoundCommandMessage, badCommand, successConfirmed} = require('./consts/telegramMessages')

const commandList = {
  start: '/start',
  confirmation: '/confirmation'
}

const commandHandlers = {
  [commandList.start]: (userId) => {
    telegramApi.sendMessage(userId, helloMessage).catch(console.log)
  },
  [commandList.confirmation]: (userId, text) => {
    const indexStartCommand = text.indexOf(commandList.confirmation)
    const code = text.substring(indexStartCommand + commandList.confirmation.length + 1)
    if (code.length > 0)
      api.sendConfirmedCode(code).then(() => {
        telegramApi.sendMessage(userId, successConfirmed).catch(console.log)
      }).catch(() => {
        telegramApi.sendMessage(userId, badCommand).catch(console.log)
      })
    else
      telegramApi.sendMessage(userId, badCommand).catch(console.log)
  }
}

function handleBadCommand (userId, errorMessage) {
  telegramApi.sendMessage(userId, errorMessage).catch(console.log)
}

function handleCommand (command, message) {
  const { from: { id: userId } } = message

  if (command in commandHandlers) {
    commandHandlers[command](userId, message.text)
  } else {
    handleBadCommand(userId, notFoundCommandMessage)
  }
}

function handleUpdate (message) {
  const command = getMessageBotCommand(message)
  if (command) handleCommand(command, message)

  console.log(message)

}

module.exports = handleUpdate

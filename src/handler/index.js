const
  api = require('../api'),
  getCommands = require('../utils/getCommands'),
  { commands: availableCommands, commandHandlers } = require('../consts/commands')

async function handler(update) {
  await api.saveMessage(update)

  const { message } = update

  if (message) {
    const commands = getCommands(message)

    const awaitingCommands = commands
      .filter(c => availableCommands.includes(c))
      .map(async c => await commandHandlers[c])

    await Promise.all(awaitingCommands)
  }

}

module.exports = handler

const handleStartCommand = require('../commandHandlers/handleStartCommand')

const commands = [ 'start' ]

const commandHandlers = {
  [commands[0]]: handleStartCommand
}

module.exports = {
  commands,
  commandHandlers
}

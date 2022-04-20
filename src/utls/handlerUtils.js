/**
 * @param {{ text: string, entities: {offset: number, length: number, type: string}[] }} message
 */
function getMessageBotCommand (message) {
  let command = false

  message.entities.forEach(entity => {
    // bot_command - type command message, check bot api docs https://core.telegram.org/bots/api#messageentity
    if (entity.type === 'bot_command') command = message.text.substr(entity.offset, entity.length)
  })

  return command
}

module.exports = {
  getMessageBotCommand
}

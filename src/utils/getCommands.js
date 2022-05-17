module.exports = (message) => message.entities
  ? message.entities
    .filter(entity => entity.type === 'bot_command')
    .map((entity) => message.text.slice(entity.offset+1, entity.length))
  : []

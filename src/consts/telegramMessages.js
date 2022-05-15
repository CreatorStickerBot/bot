const keyError = require('./keyErrorsMessage')
const {HOST} = require('../../config/config')

const getRegistrationMessage = (code) => {
  return 'Привет!\n' +
    'Вот твой код подтверждения: `' + code + '`'
}

const errorMessages = {
  [keyError.confirmed]: 'Вы уже подтвердили регистрацию!',
  [keyError.notFoundUser]: 'Привет!\nЯ не нашел тебя в списках зарегистрированных пользователей:(\n' +
    `Если хочешь зарегистрироваться, перейди пожалуйста на сайт http://${HOST}`,
  [keyError.notFoundCommand]: 'Я не знаю такой комманды',
  [keyError.badCommand]: 'Команда введена неправильно',
  [keyError.notConfirmedUser]: 'Здравствуйте! Сейчас проходит закрытое тестирование концепции.',
}

module.exports = {
  getRegistrationMessage,
  errorMessages,
}

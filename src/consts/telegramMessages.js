const helloMessage = 'Привет!\n' +
  'Если ты хочешь подтвердить регистрацию в сервисе, отправь мне пожалуйста сообщение с следющим текстом:\n\n' +
  '\`/confirmation code\`\n\n' +
  'Вместо `code` укажи свой код подтверждения\n\n'

const notFoundCommandMessage = 'Я не знаю такой комманды'

const badCommand = 'Команда введена неправильно'

const successConfirmed = 'Спасибо за регистрацию в нашем сервисе:)\n'+
  'Ссылка для перехода в личный кабинет http://localhost:2000/profile и https://google.com\n\n и http://127.0.0.1:2000/profile\n' +
  'Приятного использования)'

module.exports = {
  helloMessage,
  notFoundCommandMessage,
  badCommand,
  successConfirmed
}

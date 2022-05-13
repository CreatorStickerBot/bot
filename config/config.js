require('dotenv').config({ path: './.env' });

const
  TG_TOKEN = process.env.TG_TOKEN,
  HOST_API = 'api.telegram.org',
  PROTOCOL_API = 'https',
  PATH_BOT_API = `bot${TG_TOKEN}`,
  BOT_API_URL = `${PROTOCOL_API}://${HOST_API}/${PATH_BOT_API}`,
  FILE_API_URL = `${PROTOCOL_API}://${HOST_API}/file/${PATH_BOT_API}`,
  BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001/api',
  FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:2000'

function checkEnvs() {
  return Boolean(process.env.TG_TOKEN)
}

module.exports = {
  checkEnvs,
  TG_TOKEN,
  HOST_API,
  PROTOCOL_API,
  PATH_BOT_API,
  BOT_API_URL,
  FILE_API_URL,
  BACKEND_API_URL,
  FRONTEND_URL
}

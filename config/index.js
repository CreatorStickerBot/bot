require('dotenv').config({ path: './.env' })

module.exports = {
  VM_HOST: process.env.VM_HOST || 'localhost',
  BACKEND_PORT: process.env.BACKEND_PORT || '3001',
  NODE_ENV: process.env.NODE_ENV || 'dev',
  AVAILABLE_USERS: JSON.parse(process.env.AVAILABLE_USERS || '[]'),
  TG_TOKEN: process.env.TG_TOKEN,
  QUEUE_NAME: process.env.QUEUE_NAME || 'test-queue',
  AMQP_HOST: process.env.AMQP_HOST || 'localhost'
}

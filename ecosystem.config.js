module.exports = {
  apps: [
    { name: 'Worker requesting updates', script: './src/worker_requesting_updates.js' },
    { name: 'Worker processing incoming updates', script: './src/worker_processing_incoming_updates.js' },
  ]
}

const format = require('format-duration')

module.exports = (msg, client, args) => msg.reply(format(client.uptime))

module.exports = (msg, client, args) => msg.reply(`Pong! **${Math.round(client.ws.ping)}**ms`)

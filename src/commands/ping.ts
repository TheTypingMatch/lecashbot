const ping = (msg, client, args) => msg.reply(`Pong! **${Math.round(client.ws.ping)}**ms`)

export default ping

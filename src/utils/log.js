const fs = require('fs')
const Discord = require('discord.js')
const { logEnabled, channels, colors, version } = require('../config/config')

const sendErrorEmbed = (msg, client) => {
    const errEmbed = new Discord.MessageEmbed()
        .setColor(colors.red)
        .setAuthor('ERROR')
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(`\`\`\`js\n${msg}\`\`\``)

    const errChannels = channels.error
    return errChannels.forEach(channel => {
        const errChannel = client.channels.cache.get(channel)
        if (errChannel) errChannel.send(errEmbed)
    })
}

const logEarnings = (msg, client) => {
    const logEmbed = new Discord.MessageEmbed()
        .setColor(colors.green)
        .setDescription(msg)

    return channels.log.forEach(channel => {
        const logChannel = client.channels.cache.get(channel)
        if (logChannel) logChannel.send(logEmbed)
    })
}

module.exports = (type, msg, client) => {
    if (logEnabled) {
        fs.appendFile(`./logs/${type}.log`, `${msg} - ${new Date()}\n`, err => console.log(err || msg))
        switch (type) {
            case 'error': return sendErrorEmbed(msg, client)
            case 'cash': return logEarnings(msg, client)
        }
    }
}

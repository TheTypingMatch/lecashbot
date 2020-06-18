import * as fs from 'fs'
import { colors } from '../config/config'
import { logEnabled, channels, version } from '../config/config'
const Discord = require('discord.js')

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

    client.logger.log(msg.replace(/\*/g, ''))
    return channels.log.forEach(channel => {
        const logChannel = client.channels.cache.get(channel)
        if (logChannel) logChannel.send(logEmbed)
    })
}

const log = (type, msg, client) => {
    if (logEnabled) {
        fs.appendFile(`./logs/${type}.log`, `${msg} - ${new Date()}\n`, err => {
            if (err) {
                console.log(err)
            }
        })
        switch (type) {
            case 'error': return sendErrorEmbed(msg, client)
            case 'cash': return logEarnings(msg, client)
        }
    }
}

export { log }

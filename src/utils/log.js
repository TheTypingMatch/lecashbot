const fs = require('fs')
const config = require('../../config/config')
const client = require('../../index')
const Discord = require('discord.js')

const sendErrorEmbed = (msg, client) => {
    let errorEmbed = new Discord.RichEmbed()
        .setColor(config.colors.red)
        .setAuthor('ERROR')
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${config.version}`)
        .setDescription(`\`\`\`js\n${msg}\`\`\``)
    
    client.channels.get('692123000602099712').send(errorEmbed)
}

const logEarnings = (msg, client) => {
    let logEmbed = new Discord.RichEmbed()
        .setColor(config.colors.green)
        .setDescription(msg)

    return client.channels.get('691405983636783194').send(logEmbed)
}

module.exports = (type, msg, client) => {
    if (config.logEnabled) {
        fs.appendFile(`./logs/${type}.log`, `${msg}\n`, err => console.log(err ? err : msg))
        switch (type) {
            case 'error': sendErrorEmbed(msg, client)
            case 'cash': logEarnings(msg, client)
        }
    }
}

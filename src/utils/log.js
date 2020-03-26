const fs = require('fs')
const config = require('../../config/config')
const client = require('../../index')
const Discord = require('discord.js')

module.exports = (type, msg, client) => {
    if (config.logEnabled) {
        fs.appendFile(`./logs/${type}.log`, `${msg}\n`, err => console.log(err ? err : msg))

        let errorEmbed = new Discord.RichEmbed()
            .setColor(config.colors.red)
            .setAuthor('ERROR')
            .setTimestamp(new Date())
            .setFooter(`LeCashBot v${config.version}`)
            .setDescription(`\`\`\`js\n${msg}\`\`\``)

        client.channels.get('692123000602099712').send(errorEmbed)
    }
}

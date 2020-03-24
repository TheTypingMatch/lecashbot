const Discord = require('discord.js')
const config = require('../../config/config')
const embeds = require('../../config/embeds').helpInfo

const addHelpField = info => {
    const infoDescription = Object.entries(info).map(desc => `\`$${desc[0]}\` ${desc[1]}`)
    return `${infoDescription}`.replace(/,/g, '\n')
}

module.exports = (msg, client, args) => {

    let helpEmbed = new Discord.RichEmbed()
        .setColor(0x2ecc71)
        .setAuthor('Help', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${config.version}`)
        .setDescription(embeds.description)
        .addField('Guides', addHelpField(embeds.guides))
        .addField('Economy', addHelpField(embeds.economy))
        .addField('Games', addHelpField(embeds.games))
        .addField('Miscellaneous', addHelpField(embeds.miscellaneous))

    return msg.channel.send(helpEmbed)

}

const Discord = require('discord.js')
const config = require('../../config/config')
const embeds = require('../../config/embeds')

const addHelpField = info => {
    const infoDescription = Object.entries(info).map(desc => `\`${desc[0]}\` ${desc[1]}`)
    return `${infoDescription}`.replace(/,/g, '\n')
}

module.exports = (msg, client, args) => {

    const guides = embeds.helpInfo.guides
    const economy = embeds.helpInfo.economy
    const games = embeds.helpInfo.games
    const miscellaneous = embeds.helpInfo.miscellaneous

    let helpEmbed = new Discord.RichEmbed()
        .setColor(0x2ecc71)
        .setAuthor('Help', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${config.version}`)
        .addField('Guides', addHelpField(guides))
        .addField('Economy', addHelpField(economy))
        .addField('Games', addHelpField(games))
        .addField('Miscellaneous', addHelpField(miscellaneous))

    msg.channel.send(helpEmbed)

}

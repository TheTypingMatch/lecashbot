const { RichEmbed } = require('discord.js')
const { colors, version } = require('../../config/config')
const { desc, guides, economy, games, misc } = require('../../config/embeds').helpInfo

const addHelpField = info => {
    const infoDescription = Object.entries(info).map(desc => `\`$${desc[0]}\` ${desc[1]}`)
    return `${infoDescription}`.replace(/,/g, '\n')
}

module.exports = (msg, client, args) => {

    let helpEmbed = new RichEmbed()
        .setColor(colors.green)
        .setAuthor('Help', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(desc)
        .addField('Guides', addHelpField(guides))
        .addField('Economy', addHelpField(economy))
        .addField('Games', addHelpField(games))
        .addField('Miscellaneous', addHelpField(misc))

    return msg.channel.send(helpEmbed)

}

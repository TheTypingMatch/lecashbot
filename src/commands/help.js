const { RichEmbed } = require('discord.js')
const { colors, version } = require('../../config/config')
const { register, desc, guides, economy, games, misc } = require('../../config/embeds').helpInfo
const { addCommandField } = require('../utils/field')

module.exports = (msg, client, args) => {

    let helpEmbed = new RichEmbed()
        .setColor(colors.green)
        .setAuthor('Help', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(desc)
        .addField('Register', addCommandField(register))
        .addField('Guides', addCommandField(guides))
        .addField('Economy', addCommandField(economy))
        .addField('Games', addCommandField(games))
        .addField('Miscellaneous', addCommandField(misc))

    return msg.channel.send(helpEmbed)

}

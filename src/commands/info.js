const { MessageEmbed } = require('discord.js')
const { colors, version } = require('../config/config')
const { general, contribute, donors, invite } = require('../config/embeds').info
const { addDescriptionField } = require('../utils/field')

module.exports = (msg, client, args) => {
    const helpEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor('Info', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .addField('General', addDescriptionField(general))
        .addField('Contributors', 'See `$contributors` to view all contributors.')
        .addField('Contribute', addDescriptionField(contribute))
        .addField('Donors', addDescriptionField(donors))
        .addField('Invite', addDescriptionField(invite))

    return msg.channel.send(helpEmbed)
}

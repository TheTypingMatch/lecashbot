const { RichEmbed } = require('discord.js')
const { colors, version } = require('../../config/config')
const { donateLink, donors } = require('../../config/embeds').donate
const { addTitleField } = require('../utils/field')

module.exports = (msg, client, args) => {

    let donateEmbed = new RichEmbed()
        .setColor(colors.green)
        .setAuthor('Donate', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(donateLink)
        .addField('Donors', addTitleField(donors))

    return msg.channel.send(donateEmbed)

}

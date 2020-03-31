const { RichEmbed } = require('discord.js')
const { colors, version } = require('../../config/config')
const { general, contributors, contribute, donors } = require('../../config/embeds').info
const { addDescriptionField } = require('../utils/field')

module.exports = (msg, client, args) => {

    let helpEmbed = new RichEmbed()
        .setColor(colors.green)
        .setAuthor('Info', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .addField('General', addDescriptionField(general))
        .addField('Contributors', addDescriptionField(contributors))
        .addField('Contribute', addDescriptionField(contribute))
        .addField('Donors', addDescriptionField(donors))

    return msg.channel.send(helpEmbed)

}

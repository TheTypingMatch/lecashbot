const { RichEmbed } = require('discord.js')
const { colors, version } = require('../../config/config')
const { addDescriptionField } = require('../utils/field')
const faqInfo = require('../../config/embeds').faqInfo

module.exports = (msg, client, args) => {

    let faqEmbed = new RichEmbed()
        .setColor(colors.green)
        .setAuthor('FAQ', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
    
    faqInfo.forEach(question => faqEmbed.addField(`${question.q}`, question.a))
    return msg.channel.send(faqEmbed)

}

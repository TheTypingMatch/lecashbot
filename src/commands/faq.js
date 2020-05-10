const { MessageEmbed } = require('discord.js')
const { colors, version } = require('../config/config')
const faqInfo = require('../config/embeds').faqInfo

module.exports = (msg, client, args) => {
    const faqEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor('FAQ', msg.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)

    faqInfo.forEach(question => faqEmbed.addField(`${question.q}`, question.a))
    return msg.channel.send(faqEmbed)
}

import { MessageEmbed } from 'discord.js'
import { colors, version } from '../config/config'
import { faqInfo } from '../config/embeds'

export default (msg, client, args) => {
    const faqEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor('FAQ', msg.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)

    faqInfo.forEach(question => faqEmbed.addField(`${question.q}`, question.a))
    return msg.channel.send(faqEmbed)
}

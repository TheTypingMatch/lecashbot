const { RichEmbed } = require('discord.js')
const { colors, version } = require('../../config/config')

module.exports = async (msg, client, args) => {

    let reportEmbed = new RichEmbed()
        .setColor(colors.green)
        .setAuthor('Report', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription('Report a bug [here](https://github.com/TheTypingMatch/le-cash-bot/issues).')

    return msg.channel.send(reportEmbed)

}

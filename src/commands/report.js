const Discord = require('discord.js')
const config = require('../../config/config')

module.exports = async (msg, client, args) => {

    let reportEmbed = new Discord.RichEmbed()
        .setColor(config.colors.green)
        .setAuthor('Report', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${config.version}`)
        .setDescription('Report a bug [here](https://github.com/TheTypingMatch/le-cash-bot/issues).')

    return msg.channel.send(reportEmbed)

}

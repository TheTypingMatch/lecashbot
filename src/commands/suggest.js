const { MessageEmbed } = require('discord.js')
const { colors, version } = require('../config/config')

module.exports = async (msg, client, args) => {
    const suggestEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor('Suggest', msg.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription('Make a suggestion [here](https://github.com/TheTypingMatch/le-cash-bot/issues).')

    return msg.channel.send(suggestEmbed)
}

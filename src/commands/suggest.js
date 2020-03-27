const Discord = require('discord.js')
const config = require('../../config/config')

module.exports = async (msg, client, args) => {

    let suggestEmbed = new Discord.RichEmbed()
        .setColor(config.colors.green)
        .setAuthor('Suggest', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${config.version}`)
        .setDescription('Make a suggestion [here](https://github.com/TheTypingMatch/le-cash-bot/issues).')

    return msg.channel.send(suggestEmbed)

}

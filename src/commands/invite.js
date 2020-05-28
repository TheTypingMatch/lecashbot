const { MessageEmbed } = require('discord.js')
const { colors, version } = require('../config/config')

module.exports = async (msg, client, args) => {
    const inviteEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor('Invite', msg.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription('Invite LeCashBot [**here**](https://le-sirh.github.io/lecashbot/).')

    return msg.channel.send(inviteEmbed)
}

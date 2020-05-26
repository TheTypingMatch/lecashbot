const format = require('format-duration')
const { MessageEmbed } = require('discord.js')
const { colors, version } = require('../config/config')
const { currency } = require('../utils/format')

module.exports = async (msg, client, args) => {
    const { guilds, users, ws } = client
    const statsEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor('Stats', msg.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(`
            Servers - **${currency(guilds.cache.size)}**
            Users   - **${currency(users.cache.size)}**
            Latency - **${Math.round(ws.ping)}**ms
            Uptime - **${format(client.uptime)}**
        `)

    return msg.channel.send(statsEmbed)
}

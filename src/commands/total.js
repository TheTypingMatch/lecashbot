const User = require('../models/user.model')
const { MessageEmbed } = require('discord.js')
const { colors, version } = require('../config/config')
const { currency } = require('../utils/format')

module.exports = async (msg, client, args) => {
    const activeUsers = await User.find({ banned: false })
    const userBalances = activeUsers.map(user => user.balance)
    const total = userBalances.reduce((t, bal) => t + bal)

    const totalEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor('Total', msg.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(`All **${userBalances.length}** users have a total of $**${currency(total)}**.`)

    return msg.channel.send(totalEmbed)
}

const Discord = require('discord.js')
const config = require('../../config/config')
const User = require('../models/user.model')
const format = require('../utils/format')

module.exports = async (msg, client, args) => {

    const activeUsers = await User.find({ banned: false })
    const userBalances = activeUsers.map(user => user.balance)
    const total = userBalances.reduce((t, bal) => t + bal)

    let totalEmbed = new Discord.RichEmbed()
        .setColor(config.colors.green)
        .setAuthor('Total', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${config.version}`)
        .setDescription(`All users have a total of $**${format.currency(total)}**.`)

    return msg.channel.send(totalEmbed)

}

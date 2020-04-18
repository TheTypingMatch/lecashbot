const User = require('../models/user.model')
const { RichEmbed } = require('discord.js')
const { colors, version } = require('../../config/config')
const { currency } = require('../utils/format')

module.exports = async (msg, client, args) => {

    const err = 'This user does not have an account!'
    const userId = args[0] ? args[0].replace(/<|@|!|>/g, '') : msg.author.id
    
    const isNotId = (isNaN(parseInt(userId)))
    const userData = (isNotId) ? { name: args.join(' ').trim() } : { discordId: userId }
    const user = await User.findOne(userData)
    const result = user ? `${user.name}'s balance is **$${currency(user.balance)}**.` : err
    
    let balanceEmbed = new RichEmbed()
        .setColor(colors.green)
        .setAuthor('Balance', client.users.get((isNotId) ? user.discordId : userId).avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(result)

    return msg.channel.send(balanceEmbed)

}

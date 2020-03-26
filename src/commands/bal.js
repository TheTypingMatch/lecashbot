const Discord = require('discord.js')
const config = require('../../config/config')
const User = require('../models/user.model')
const format = require('../utils/format')

module.exports = async (msg, client, args) => {

    const err = 'This user does not have an account!'
    const userId = args[0] ? args[0].replace(/<|@|!|>/g, '') : msg.author.id
    const user = await User.findOne({ discordId: userId })
    const result = user ? `${user.name}'s balance is **$${format.currency(user.balance)}**.` : err
    
    let balanceEmbed = new Discord.RichEmbed()
        .setColor(config.colors.green)
        .setAuthor('Balance', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${config.version}`)
        .setDescription(result)

    return msg.channel.send(balanceEmbed)

}

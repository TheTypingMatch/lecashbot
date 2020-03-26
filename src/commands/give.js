const Discord = require('discord.js')
const config = require('../../config/config')
const User = require('../models/user.model')
const log = require('../utils/log')

const sendSuccessEmbed = (msg, err) => {

    let successEmbed = new Discord.RichEmbed()
        .setColor(err ? config.colors.red : config.colors.green)
        .setAuthor(`${err ? 'Error' : 'Success!'}`, msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${config.version}`)
        
    if (err) {
        succeessEmbed.setDescription('An error occurred.')
        log('error', err, client)
    }

    msg.channel.send(successEmbed)

}

module.exports = async (msg, client, args) => {
    
    const receiverId = { discordId: args[0].replace(/<|@|!|>/g, '') }
    const userId = { discordId: msg.author.id }
    const receiver = await User.findOne(receiverId)
    const user = await User.findOne(userId)
    
    if (!args[1]) return msg.reply('No amount given.')
    if (!user || !receiver) return msg.reply('User not found!')
    if (args[1] < 100) return msg.reply('Minimum gift amount is $**100**.')
    
    const receiverBal = receiver.balance
    const userBal = user.balance
    const gift = parseInt(args[1])

    if (userBal < gift)
        return msg.reply(`You do not have enough in your balance: $**${user.balance}**`)

    User.updateOne(receiverId, { balance: receiverBal + gift }, err => {
        if (err) sendSuccessEmbed(msg, err)
    })
    
    User.updateOne(userId, { balance: userBal - gift }, err => sendSuccessEmbed(msg, err))

}

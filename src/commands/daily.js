const Discord = require('discord.js')
const User = require('../models/user.model')
const cooldowns = require('../../config/cooldowns')
const config = require('../../config/config')
const date = require('../utils/date')
const log = require('../utils/log')
const format = require('../utils/format')

const sendReward = (msg, user) => {

    const dailyStreak = user.dailyStreak
    const bal = user.balance
    const userCooldowns = user.cooldowns

    const reward = (dailyStreak * 25) + 100
    userCooldowns.daily = new Date()

    let dailyEmbed = new Discord.RichEmbed()
        .setColor(config.colors.green)
        .setAuthor('Daily', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${config.version}`)
        .setDescription(`${user.name} just earned $**${format.currency(reward)}** with a streak of **${user.dailyStreak + 1}**!`)

    User.updateOne({ 
        discordId: msg.author.id 
    }, {
        balance: bal + reward, 
        dailyStreak: dailyStreak + 1,
        cooldowns: userCooldowns
    }, err => {
        msg.channel.send(err ? 'An error occurred.' : dailyEmbed)
        if (err) {
            msg.chanenl.send('An error occurred. This is being reported to the developers.')
            log('error', err, client)
        }
    })

}

const sendTimeLeft = (msg, user, dailyCooldown) => {

    const hoursLeft = date.toHours(cooldowns.daily) - date.toHours(dailyCooldown)
    const isMinutes = (hoursLeft < 1)
    const timeLeft = isMinutes ? hoursLeft * 60 : hoursLeft

    let cooldownEmbed = new Discord.RichEmbed()
        .setColor(config.colors.yellow)
        .setAuthor('Daily', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${config.version}`)
        .setDescription(`You can collect your daily reward in **${Math.round(timeLeft)}** ${isMinutes ? 'minutes' : 'hours'}`)
    
    msg.channel.send(cooldownEmbed)

}

module.exports = async (msg, client, args) => {

    const user = await User.findOne({ discordId: msg.author.id })

    const lastDaily = user.cooldowns.daily
    const dailyCooldown = new Date() - lastDaily
    const isWithinTimeout = (user && dailyCooldown >= cooldowns.daily)

    return (isWithinTimeout) ? sendReward(msg, user) : sendTimeLeft(msg, user, dailyCooldown)

}

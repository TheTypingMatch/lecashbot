const User = require('../models/user.model')
const checkErr = require('../utils/checkErr')
const { RichEmbed } = require('discord.js')
const { daily } = require('../../config/cooldowns')
const { colors, version } = require('../../config/config')
const { toHours } = require('../utils/date')
const { currency } = require('../utils/format')

const sendReward = (msg, user, client) => {

    const { balance, dailyStreak, cooldowns } = user
    const userId = { discordId: msg.author.id }

    const reward = (dailyStreak * 25) + 100
    cooldowns.daily = new Date()

    let dailyEmbed = new RichEmbed()
        .setColor(colors.green)
        .setAuthor('Daily', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(`${user.name} just earned $**${currency(reward)}** with a streak of **${user.dailyStreak + 1}**!`)

    return User.updateOne(userId, {
        balance: balance + reward, 
        dailyStreak: dailyStreak + 1,
        cooldowns: cooldowns
    }, err => checkErr(err, client, () => msg.channel.send(dailyEmbed)))

}

const sendTimeLeft = (msg, dailyCooldown) => {

    const hoursLeft = toHours(daily - dailyCooldown)
    const isMinutes = (hoursLeft < 1)
    const timeLeft = isMinutes ? hoursLeft * 60 : hoursLeft

    let cooldownEmbed = new RichEmbed()
        .setColor(colors.yellow)
        .setAuthor('Daily', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(`You can collect your daily reward in **${Math.round(timeLeft)}** ${isMinutes ? 'minutes' : 'hours'}`)
    
    return msg.channel.send(cooldownEmbed)

}

module.exports = async (msg, client, args) => {

    const user = await User.findOne({ discordId: msg.author.id })

    const lastDaily = user.cooldowns.daily
    const dailyCooldown = new Date() - lastDaily
    const isWithinTimeout = (user && dailyCooldown >= daily)

    return (isWithinTimeout) ? sendReward(msg, user, client) : sendTimeLeft(msg, dailyCooldown)

}

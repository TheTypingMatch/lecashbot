const User = require('../models/user.model')
const checkErr = require('../utils/checkErr')
const { MessageEmbed } = require('discord.js')
const { daily } = require('../config/cooldowns')
const { colors, version } = require('../config/config')
const { toHours, toMinutes } = require('../utils/date')
const { currency } = require('../utils/format')

const sendReward = (msg, user, client, embed) => {
    const { name, balance, dailyStreak, cooldowns } = user
    const userId = { discordId: msg.author.id }

    const reward = (dailyStreak * 25) + 100
    cooldowns.daily = new Date()

    embed
        .setColor(colors.green)
        .setDescription(`**${name}** just earned $**${currency(reward)}** with a streak of **${dailyStreak + 1}**!`)

    return User.updateOne(userId, {
        balance: balance + reward,
        dailyStreak: dailyStreak + 1,
        cooldowns: cooldowns
    }, err => checkErr(err, client, () => msg.channel.send(embed)))
}

const sendTimeLeft = (msg, dailyCooldown, embed) => {
    let timeLength = 'seconds'
    let timeLeft = daily - dailyCooldown

    if ((timeLeft / 1000) > 60 && toHours(timeLeft) < 1) {
        timeLength = 'minutes'
        timeLeft = toMinutes(timeLeft)
    } else if (toHours(timeLeft) > 1) {
        timeLength = 'hours'
        timeLeft = toHours(timeLeft)
    } else timeLeft = timeLeft / 1000

    embed
        .setColor(colors.yellow)
        .setDescription(`You can collect your daily reward in **${Math.ceil(timeLeft)}** ${timeLength}`)

    return msg.channel.send(embed)
}

module.exports = async (msg, client, args) => {
    const user = await User.findOne({ discordId: msg.author.id })

    const lastDaily = user.cooldowns.daily
    const dailyCooldown = new Date() - lastDaily
    const isWithinTimeout = (user && dailyCooldown >= daily)

    const dailyEmbed = new MessageEmbed()
        .setAuthor('Daily', msg.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)

    return (isWithinTimeout)
        ? sendReward(msg, user, client, dailyEmbed)
        : sendTimeLeft(msg, dailyCooldown, dailyEmbed)
}

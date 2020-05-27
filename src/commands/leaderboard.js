const User = require('../models/user.model')
const { MessageEmbed } = require('discord.js')
const { colors, version } = require('../config/config')
const { currency } = require('../utils/format')

let desc = ''
const lbEmbed = new MessageEmbed()
    .setColor(colors.green)
    .setAuthor('Leaderboard')
    .setTimestamp(new Date())
    .setFooter(`LeCashBot v${version}`)

const getTopTen = arr => arr.slice(-10).reverse()

// The sort type is the property of users that the function sorts by
const sortUsers = (users, sortType) => {
    return users.sort((a, b) => {
        return (a[sortType] > b[sortType]) ? 1 : (
            (b[sortType] > a[sortType]) ? -1 : 0
        )
    })
}

const handleBetLb = (msg, users) => {
    const sortedUsers = users.sort((a, b) => {
        const aBet = a.highestBet.amount
        const bBet = b.highestBet.amount
        return (aBet > bBet) ? 1 : ((bBet > aBet) ? -1 : 0)
    })
    const topTen = getTopTen(sortedUsers)

    let userPosition = 'You are not ranked!'
    let userBet = 'N/A'
    let userBetChance = 'N/A'
    sortedUsers.reverse().forEach((user, index) => {
        if (user.discordId === msg.author.id) {
            userPosition = index + 1
            userBet = user.highestBet.amount
            userBetChance = Math.round(user.highestBet.chance * 100) / 100
        }
    })

    topTen.forEach(({ highestBet, name }, pos) => {
        const betAmount = currency(highestBet.amount)
        const betChance = Math.round(highestBet.chance * 100) / 100
        desc += `#**${pos + 1}** ${name} - $**${betAmount}** - ${betChance}%\n`
    })
    desc += `#**${userPosition}** - YOU - $**${currency(userBet)}** - ${userBetChance}%`

    lbEmbed.setDescription(desc)
    desc = ''

    return msg.channel.send(lbEmbed)
}

const handleCashLb = (msg, users) => {
    const sortedUsers = sortUsers(users, 'balance')
    const topTen = getTopTen(sortedUsers)

    let userPosition = 'N/A'
    let userBalance = 'N/A'
    sortedUsers.reverse().forEach(({
        discordId,
        balance
    }, index) => {
        if (discordId === msg.author.id) {
            userPosition = index + 1
            userBalance = balance
        }
    })

    topTen.forEach((user, pos) => {
        desc += `#**${pos + 1}** ${user.name} - $**${currency(user.balance)}**\n`
    })
    desc += `#**${userPosition}** - YOU - $**${currency(userBalance)}**`
    lbEmbed.setDescription(desc)
    desc = ''

    return msg.channel.send(lbEmbed)
}

const handleStreakLb = (msg, users) => {
    sortedUsers = sortUsers(users, 'dailyStreak')
    topTen = getTopTen(sortedUsers)

    let userPosition = 'N/A'
    let userStreak = 'N/A'
    sortedUsers.reverse().forEach(({
        discordId,
        dailyStreak
    }, index) => {
        if (discordId === msg.author.id) {
            userPosition = index + 1
            userStreak = dailyStreak
        }
    })

    topTen.forEach((user, pos) => {
        desc += `#**${pos + 1}** ${user.name} - **${currency(user.dailyStreak)}**\n`
    })
    desc += `#**${userPosition}** - YOU - **${currency(userStreak)}**`
    lbEmbed.setDescription(desc)
    desc = ''

    return msg.channel.send(lbEmbed)
}

module.exports = async (msg, client, args) => {
    const users = await User.find({ banned: false })
    if (!users) log('error', `ERROR: DB could not find users:\n**${users}**`, client)

    switch (args[0]) {
        case 'cash': return handleCashLb(msg, users)
        case 'bet': return handleBetLb(msg, users)
        case 'streak': return handleStreakLb(msg, users)
        default: return handleCashLb(msg, users)
    }
}

import { User } from '../models/user.model'
import { MessageEmbed } from 'discord.js'
import { colors, version } from '../config/config'
import { currency } from '../utils/format'
import { addCommandField } from '../utils/field'
import { log } from '../utils/log'
import { Leaderboard } from '../models/leaderboard.model'

let desc = ''
const helpInfo: any = {
    'leaderboard bet': '- Display the highest bets won.',
    'leaderboard streak': '- Display the highest daily streaks.',
    'leaderboard cash': '- Display the wealthiest users.',
    'leaderboard coinflip': '- Display the luckiest users.'
}

const lbEmbed = new MessageEmbed()
    .setColor(colors.green)
    .setAuthor('Leaderboard')
    .setFooter(`LeCashBot v${version}`)

const handleHelpLb = msg => {
    const lbHelpEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor('Leaderboard')
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(addCommandField(helpInfo))

    return msg.channel.send(lbHelpEmbed.setTimestamp(new Date()))
}

const formatFlipLb = (msg, topTen) => {
    topTen.forEach(({ coinflipBestStreak, name }, pos) => {
        const coinflipAmount: number = (coinflipBestStreak) ? Math.round((100 * (3 ** (coinflipBestStreak - 2))) + ((coinflipBestStreak - 1) * 150)) : 0
        const coinflipChance: number = (coinflipBestStreak) ? Math.round((100 / (2 ** coinflipBestStreak)) * 100) / 100 : 0
        desc += `#**${pos + 1}** ${name} - **${coinflipBestStreak}** - $**${currency(coinflipAmount)}** - ${coinflipChance}%\n`
    })
}

const formatBetLb = (msg, topTen) => {
    topTen.forEach(({ highestBet, name }, pos) => {
        const betAmount: string = currency(highestBet.amount)
        const betChance: number = Math.round(highestBet.chance * 100) / 100
        desc += `#**${pos + 1}** ${name} - $**${betAmount}** - ${betChance}%\n`
    })
}

const formatCashLb = (msg, topTen) => {
    topTen.forEach((user, pos: number) => {
        desc += `#**${pos + 1}** ${user.name} - $**${currency(user.balance)}**\n`
    })
}

const formatStreakLb = (msg, topTen) => {
    topTen.forEach((user, pos) => {
        desc += `#**${pos + 1}** ${user.name} - **${currency(user.dailyStreak)}**\n`
    })
}

const handleLeaderboard = (msg, type) => {
    let desc: string = ''
    const lbEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor('Leaderboard')
        .setFooter(`LeCashBot v${version}`)
    
    const leaderboardInfo = Leaderboard.findOne({ version: 1 });
    
    switch (leaderboardInfo[type]) {
        case 'streak': formatStreakLb(msg, leaderboardInfo[type])
        case 'balance': formatCashLb(msg, leaderboardInfo[type])
        case 'coinflip': formatFlipLb(msg, leaderboardInfo[type])
        case 'bet': formatBetLb(msg, leaderboardInfo[type])
    }

    lbEmbed.setDescription(desc)
    desc = ''

    return msg.channel.send(lbEmbed.setTimestamp(new Date()))
}

export default async (msg, client, args) => {
    if (args[0] === 'help') {
        return handleHelpLb(msg);
    }

    return handleLeaderboard(msg, args[0]);
}

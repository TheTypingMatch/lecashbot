import { User } from '../models/user.model'
import { checkErr } from '../utils/checkErr'
import { MessageEmbed } from 'discord.js'
import { colors, version } from '../config/config'
import { currency } from '../utils/format'

const sendReward = (msg, user, client, embed, recordEmbed) => {
    const { name, balance, coinflipStreak, coinflipBestStreak } = user
    const userId: { discordId: string } = { discordId: msg.author.id }
    const reward: number = Math.round(100 * (3 ** (coinflipStreak - 1)) + (coinflipStreak * 150))
    const streakChance: number = Math.round((100 / (2 ** (coinflipStreak + 1))) * 100) / 100
    const cost: number = (coinflipStreak) ? Math.round(100 * (2 ** coinflipStreak)) : 0
    const profit: number = reward - cost

    if (balance && balance < cost) {
        embed.setDescription('You do not have enough to coinflip!')
        return msg.channel.send(embed)
    }
    
    const nextCost: number = 100 * (2 ** (coinflipStreak + 1))
    const nextReward: number = 100 * (3 ** coinflipStreak) + ((coinflipStreak + 1) * 150)
    const description: any = {
        reward: `**${name}** just earned $**${currency(reward)}**`,
        streak: `with a streak of **${coinflipStreak + 1}**!`,
        chance: `The chances of winning this is **${streakChance}**%!`,
        nextCostMsg: `Your next coin flip will cost $**${currency(nextCost)}**.`,
        nextRewardMsg: `If you win your next flip, you will win $**${currency(nextReward)}**!`
    }
    
    const { nextCostMsg, nextRewardMsg, streak, chance } = description
    const message = `${description.reward} ${streak}\n${chance}\n${nextCostMsg}\n${nextRewardMsg}`

    if (coinflipStreak + 1 > coinflipBestStreak) {
        const newStreakDesc = `New highest coin flip streak of **${coinflipStreak + 1}**!`
        msg.channel.send(recordEmbed.setDescription(newStreakDesc))
        User.updateOne(userId, {
            coinflipBestStreak: coinflipStreak + 1
        }, (err: any) => {
            if (err) { 
                client.logger.log('Unable to update coinflip streak record.', 'error')
            }
        })
    }
    
    embed
        .setColor(colors.green)
        .setDescription(message)

    return User.updateOne(userId, {
        balance: balance + profit,
        coinflipStreak: coinflipStreak + 1
    }, (err: any) => checkErr(err, client, () => msg.channel.send(embed)))
}

const sendLoss = (msg, user, client, embed) => {
    const { balance, coinflipStreak } = user
    const cost: number = (coinflipStreak) ? Math.round(100 * (2 ** coinflipStreak)) : 0
    const userId: { discordId: string } = { discordId: msg.author.id }

    if (balance && balance < cost) {
        embed.setDescription('You do not have enough to coinflip!')
        return msg.channel.send(embed)
    }

    embed
        .setColor(colors.red)
        .setDescription(
            (coinflipStreak)
                ? `You lost your streak and $**${currency(cost)}**!`
                : 'Your streak remains at 0.'   
        )

    return User.updateOne(userId, {
        balance: balance - cost,
        coinflipStreak: 0
    }, (err: any) => checkErr(err, client, () => msg.channel.send(embed)))
}

const takeReward = (msg, client, user, embed) => {
    const { balance, coinflipStreak } = user
    const userId: { discordId: string } = { discordId: msg.author.id }
    const reward: number = Math.round(100 * (3 ** (coinflipStreak - 1)) + (coinflipStreak * 150))

    embed
        .setColor(colors.green)
        .setDescription(`You won!`)

    return User.updateOne(userId, {
        balance: balance + reward,
        coinflipStreak: 0
    }, (err: any) => checkErr(err, client, () => msg.channel.send(embed)))
}

export default async (msg, client, args) => {

    const user: any = await User.findOne({ discordId: msg.author.id })
    const flip: number = Math.random()
    const recordEmbed = new MessageEmbed()
        .setAuthor('New Highest Streak!')
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setColor(colors.green)
    const flipEmbed = new MessageEmbed()
        .setAuthor('Coin Flip', msg.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)

    if (args[0].toLowerCase() === 'take') {
        return (user.coinflipStreak > 2) 
            ? takeReward(msg, client, user, flipEmbed) 
            : msg.channel.send(
                flipEmbed
                    .setDescription('Your streak is not high enough!')
                    .setColor(colors.yellow)
            )
    }

    return (flip > 0.5)
        ? sendReward(msg, user, client, flipEmbed, recordEmbed)
        : sendLoss(msg, user, client, flipEmbed)
}

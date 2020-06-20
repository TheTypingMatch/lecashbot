import { User } from '../models/user.model'
import { checkErr } from '../utils/checkErr'
import { MessageEmbed } from 'discord.js'
import { colors, version } from '../config/config'
import { currency } from '../utils/format' 

const sendReward = (msg, user, client, embed) => {
    const { name, balance, coinflipStreak } = user
    const userId: { discordId: string } = { discordId: msg.author.id }
    const reward: number = 100 * (3 ** (coinflipStreak - 1)) + (coinflipStreak * 150)
    const cost: number = 100 * (2 ** coinflipStreak)
    const profit: number = reward - cost

    if (balance < cost) {
        return embed.setDescription('You do not have enough to coinflip!')
    }

    const nextCost: number = 100 * (2 ** coinflipStreak + 1)
    const nextReward: number = 100 * (3 ** (coinflipStreak)) + ((coinflipStreak + 1) * 150)
    const description: any = {
        reward: `**${name}** just earned $**${currency(profit)}**`,
        streak: `with a streak of **${coinflipStreak + 1}**!`,
        nextCostMsg: `Your next coin flip will cost $**${nextCost}**.`,
        nextRewardMsg: `If you win your next flip, you will win $**${nextReward}**!`
    }

    const { nextCostMsg, nextRewardMsg, streak } = description
    const message = `${description.reward} ${streak}\n${nextCostMsg}\n${nextRewardMsg}`

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
    const cost: number = 100 * (2 ** coinflipStreak)
    const userId: { discordId: string } = { discordId: msg.author.id }

    if (balance < cost) {
        return embed.setDescription('You do not have enough to coinflip!')
    }

    embed
        .setColor(colors.yellow)
        .setDescription(
            (coinflipStreak)
            ? `You lost $**${cost}**!`
            : 'You lost your streak!'
        )

    return User.updateOne(userId, {
        balance: balance - cost,
        coinflipStreak: 0
    }, (err: any) => checkErr(err, client, () => msg.channel.send(embed)))
}

export default async (msg, client, args) => {
    const user: any = await User.findOne({ discordId: msg.author.id })
    const flip: number = Math.random()
    const flipEmbed = new MessageEmbed()
        .setAuthor('Coin Flip', msg.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)

    return (flip > 0.5)
        ? sendReward(msg, user, client, flipEmbed)
        : sendLoss(msg, user, client, flipEmbed)
}

import { User } from '../models/user.model'
import { checkErr } from '../utils/checkErr'
import { MessageEmbed } from 'discord.js'
import { colors, version } from '../config/config'
import { currency } from '../utils/format' 

const sendReward = (msg, user, client, embed) => {
    const { name, balance, coinflipStreak } = user
    const userId: { discordId: string } = { discordId: msg.author.id }
    const reward: number = 100 * (4 ** (coinflipStreak - 1))

    if (balance < reward) {
        return embed.setDescription('You do not have enough to coinflip!')
    }

    embed
        .setColor(colors.green)
        .setDescription(`**${name}** just earned $**${currency(reward)}** with a streak of **${coinflipStreak + 1}**!`)

    return User.updateOne(userId, {
        balance: balance + reward,
        coinflipStreak: coinflipStreak + 1
    }, (err: any) => checkErr(err, client, () => msg.channel.send(embed)))
}

const sendLoss = (msg, user, client, embed) => {
    const { balance, coinflipStreak } = user
    const reward: number = 100 * (2 ** (coinflipStreak - 1))
    const userId: { discordId: string } = { discordId: msg.author.id }

    if (balance < reward) {
        return embed.setDescription('You do not have enough to coinflip!')
    }

    embed
        .setColor(colors.yellow)
        .setDescription('You lost your streak!')

    return User.updateOne(userId, {
        balance: balance - reward,
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

    return (flip >= 0.5)
        ? sendReward(msg, user, client, flipEmbed)
        : sendLoss(msg, user, client, flipEmbed)
}

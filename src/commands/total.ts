import { User } from '../models/user.model'
import { MessageEmbed } from 'discord.js'
import { colors, version } from '../config/config'
import { currency } from '../utils/format'

export default async (msg, client, args) => {
    const activeUsers = await User.find({ banned: false })
    const userBalances = activeUsers.map((user: any) => user.balance)
    const total: number = userBalances.reduce((t: number, bal: number) => t + bal)

    const totalEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor('Total', msg.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(`All **${userBalances.length}** users have a total of $**${currency(total)}**.`)

    return msg.channel.send(totalEmbed)
}

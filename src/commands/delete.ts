import { User } from '../models/user.model'
import { checkErr } from '../utils/checkErr'
import { MessageEmbed } from 'discord.js'
import { colors, version } from '../config/config'

const deleteEmbed = new MessageEmbed()
    .setColor(colors.green)
    .setTimestamp(new Date())
    .setFooter(`LeCashBot v${version}`)
    .setDescription('Your data has been deleted.')

const deleteData = async (id, msg) => {
    await User.deleteOne({ discordId: id }, err => checkErr(err, client))
    return msg.channel.send(deleteEmbed)
}

const deleteUser = async (msg, client, args) => {
    const error = 'You must type your Discord name: `$delete DISCORD_ID`'

    const userId = args[0]
    const user = await User.findOne({ discordId: msg.author.id }, err => checkErr(err, client))

    deleteEmbed.setAuthor('Delete', msg.author.avatarURL())

    return (userId && userId === user.discordId)
        ? deleteData(msg.author.id, msg)
        : msg.reply(error)
}

export default deleteUser 

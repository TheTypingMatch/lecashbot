const User = require('../models/user.model')
const checkErr = require('../utils/checkErr')
const { MessageEmbed } = require('discord.js')
const { colors, version } = require('../config/config')

const deleteEmbed = new MessageEmbed()
    .setColor(colors.green)
    .setAuthor('Delete', msg.author.avatarURL)
    .setTimestamp(new Date())
    .setFooter(`LeCashBot v${version}`)
    .setDescription('Your data has been deleted.')

const deleteData = async id => {
    await User.deleteOne({ discordId: id }, err => checkErr(err))
    return msg.channel.send(deleteEmbed)
}

module.exports = async (msg, client, args) => {
    const error = 'You must type your Discord name: `$delete DISCORD_ID`'

    const userId = args[0]
    const user = await User.findOne({ discordId: msg.author.id }, err => checkErr(err))

    return (userId && userId === user.discordId)
        ? deleteData(msg.author.id)
        : msg.reply(error)
}

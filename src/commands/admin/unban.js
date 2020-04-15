const User = require('../../models/user.model')
const log = require('../../utils/log')
const { RichEmbed } = require('discord.js')
const { colors, version } = require('../../../config/config')

module.exports = async (msg, client, args) => {

    const err = 'This user does not have an account!'
    const userId = args[0] ? args[0].replace(/<|@|!|>/g, '') : msg.author.id
    const id = { discordId: userId }
    const user = await User.findOne(id)
    let result = (user && !user.dev) ? `${user.name} has been unbanned.` : err
    
    if (!user.dev)
        User.update(id, { banned: false }, e => log('error', e, client))
    else result = 'You can\'t unban a developer/admin!'

    let unbanEmbed = new RichEmbed()
        .setColor(colors.green)
        .setAuthor('Unban', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(result)

    return msg.channel.send(unbanEmbed)

}

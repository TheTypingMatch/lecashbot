const User = require('../../models/user.model')
const log = require('../../utils/log')
const { RichEmbed } = require('discord.js')
const { colors, version } = require('../../../config/config')

module.exports = async (msg, client, args) => {

    let err = 'This user does not have an account!'
    const userId = args[0] ? args[0].replace(/<|@|!|>/g, '') : msg.author.id
    const user = await User.findOne({ discordId: userId })
    const result = (user && !user.dev) ? `${user.name} has been banned.` : err
    
    if (!user.dev) {
        User.update({ discordId: userId }, { banned: true }, e => {
            err = 'There was an error banning this user.'
            log('error', e, client)
        })
    } else err = 'You can\'t ban a developer!'

    let banEmbed = new RichEmbed()
        .setColor(colors.green)
        .setAuthor('Ban', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(result)

    return msg.channel.send(banEmbed)

}

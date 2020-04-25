const User = require('../models/user.model')
const { RichEmbed } = require('discord.js')
const { colors, version } = require('../../config/config')

const addField = userData => {
    const field = `${userData.map(user => `<@${user.id}>`)}`
    return (userData.length > 5) ? field.replace(/,/g, ' ') : field.replace(/,/g, '\n')
}

const getContributors = async type => {

    const contributors = await User.find({ [type]: true })
    return contributors.map(contributor => ({
        id: contributor.discordId, 
        [type]: true
    }))

}

module.exports = async (msg, client, args) => {

    const admins = await getContributors('admin')
    const devs = await getContributors('dev')
    const testers = await getContributors('tester')

    let helpEmbed = new RichEmbed()
        .setColor(colors.green)
        .setAuthor('Contributors', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .addField('Admins', addField(admins) || 'N/A')
        .addField('Developers', addField(devs) || 'N/A')
        .addField('Testers', addField(testers) || 'N/A')
        .addField('Donors', 'See `$donate` to view cash donors.')

    return msg.channel.send(helpEmbed)

}

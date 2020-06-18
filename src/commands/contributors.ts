import { User } from '../models/user.model'
import { MessageEmbed } from 'discord.js'
import { colors, version } from '../config/config'

const addField = userData => {
    const field = `${userData.map(user => `<@${user.id}>`)}`
    return (userData.length > 5)
        ? field.replace(/,/g, ' ')
        : field.replace(/,/g, '\n')
}

const getContributors = async type => {
    const contributors = await User.find({ [type]: true })
    return contributors.map(contributor => ({
        id: contributor.discordId,
        [type]: true
    }))
}

const contributors = async (msg, client, args) => {
    const admins = await getContributors('admin')
    const devs = await getContributors('dev')
    const testers = await getContributors('tester')

    const helpEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor('Contributors', msg.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .addField('Admins', addField(admins))
        .addField('Developers', addField(devs))
        .addField('Testers', addField(testers))
        .addField('Donors', 'See `$donate` to view cash donors.')

    return msg.channel.send(helpEmbed)
}

export default contributors 

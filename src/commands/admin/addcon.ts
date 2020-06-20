import { User } from '../../models/user.model'
import { checkErr } from '../../utils/checkErr'
import { MessageEmbed } from 'discord.js'
import { colors, version } from '../../config/config' 

export default async ({ author, channel }, client, args) => {
    let result: string = 'This user does not have an account!'
    const userId: string = args[0] ? args[0].replace(/<|@|!|>/g, '') : author.id
    const id: { discordId: string } = { discordId: userId }
    const user: any = await User.findOne(id)
    const contribution: string = args[1]

    if (contribution) {
        const contributionData: {} = { [contribution]: true }

        if (contribution === 'donor' && args[2]) {
            Object.assign(contributionData, {
                donations: parseInt(args[2])
            })
        } else if (contribution === 'donor' && !args[2]) {
            return channel.send('Missing args: `$addcon <user> <contribution> <donation-amount>`')
        }

        User.updateOne(id, contributionData)
        result = `**${user.name}** has been added as a(n) **${contribution}**!`
    } else result = 'An error occurred: No contribution given.'

    const contributorEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor('Add Contributor', author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(result)

    return channel.send(contributorEmbed)
}

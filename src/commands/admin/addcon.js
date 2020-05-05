const User = require('../../models/user.model')
const checkErr = require('../../utils/checkErr')
const { RichEmbed } = require('discord.js')
const { colors, version } = require('../../../config/config')

module.exports = async ({ author, channel }, client, args) => {
    let result = 'This user does not have an account!'
    const userId = args[0] ? args[0].replace(/<|@|!|>/g, '') : author.id
    const id = { discordId: userId }
    const user = await User.findOne(id)
    const contribution = args[1]

    if (contribution) {
        const contributionData = { [contribution]: true }

        if (contribution === 'donor' && args[2]) {
            Object.assign(contributionData, {
                donations: parseInt(args[2])
            })
        } else if (contribution === 'donor' && !args[2]) {
            return channel.send('Missing args: `$addcon <user> <contribution> <donation-amount>`')
        }

        User.updateOne(id, contributionData, e => checkErr(e, client))
        result = `**${user.name}** has been added as a(n) **${contribution}**!`
    } else result = 'An error occurred: No contribution given.'

    const contributorEmbed = new RichEmbed()
        .setColor(colors.green)
        .setAuthor('Add Contributor', author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(result)

    return channel.send(contributorEmbed)
}

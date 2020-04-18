const User = require('../models/user.model')
const { RichEmbed } = require('discord.js')
const { colors, version } = require('../../config/config')
const { currency } = require('../utils/format')

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

const addBadgeEmote = badgeType => {
    switch (badgeType) {
        case 'owner': return 'white_check_mark'
        case 'admin': return 'hammer'
        case 'developer': return 'man_technologist'
        case 'tester': return 'test_tube'
        case 'donor': return 'moneybag'
    }
}

const addBadges = badges => {
    let badgeMsg = ''
    Object.entries(badges).forEach(badge => {
        const badgeType = badge[0]
        const hasRole = badge[1]
        if (hasRole) badgeMsg += `\n:${addBadgeEmote(badgeType)}: ${capitalize(badgeType)}`
    })
    return badgeMsg
}

module.exports = async (msg, client, args) => {

    const userId = args[0] ? args[0].replace(/<|@|!|>/g, '') : msg.author.id
    const user = await User.findOne({ discordId: userId })
    const { name, nitroTypeLink, balance, dailyStreak, highestBet } = user

    const badges = {
        owner: (user.owner),
        admin: (user.admin), 
        developer: (user.dev),
        tester: (user.tester),
        donor: (user.donor)
    }

    let profileEmbed = new RichEmbed()
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)

    if (user) {
        profileEmbed
            .setColor(colors.green)
            .setAuthor(`${name}'s Profile`, client.users.get(userId).avatarURL)
            .setDescription(`View ${name}'s profile [here](${nitroTypeLink})`)
            .addField('Contributions', `${addBadges(badges)}`)
            .addField('Balance', `$**${currency(balance)}**`)
            .addField('Daily Streak', `**${dailyStreak}** day${dailyStreak > 1 ? 's' : ''}`)
            .addField('Highest Bet', `$**${currency(highestBet.amount)}**`, true)
            .addField('Chance', `**${highestBet.chance}**%`, true)
    } else {
        profileEmbed
            .setColor(colors.red)
            .setAuthor(`Unknown Profile`, msg.author.avatarURL)
            .setDescription('This user does not have an account!')
    }

    return msg.channel.send(profileEmbed)

}

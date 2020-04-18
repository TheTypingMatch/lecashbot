const User = require('../models/user.model')
const { RichEmbed } = require('discord.js')
const { colors, version } = require('../../config/config')
const { currency } = require('../utils/format')

module.exports = async (msg, client, args) => {

    const userId = args[0] ? args[0].replace(/<|@|!|>/g, '') : msg.author.id
    const user = await User.findOne({ discordId: userId })
    const { name, nitroTypeLink, balance, dailyStreak, highestBet } = user

    let profileEmbed = new RichEmbed()
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)

    if (user) {
        profileEmbed
            .setColor(colors.green)
            .setAuthor(`${name}'s Profile`, client.users.get(userId).avatarURL)
            .setDescription(`View ${name}'s profile [here](${nitroTypeLink})`)
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

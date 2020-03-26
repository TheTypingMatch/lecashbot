const Discord = require('discord.js')
const config = require('../../config/config')
const User = require('../models/user.model')
const format = require('../utils/format')

module.exports = async (msg, client, args) => {

    const userId = args[0] ? args[0].replace(/<|@|!|>/g, '') : msg.author.id
    const user = await User.findOne({ discordId: userId })

    let profileEmbed = new Discord.RichEmbed()
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${config.version}`)

    if (user) {
        profileEmbed
            .setColor(config.colors.green)
            .setAuthor(`${user.name}'s Profile`, msg.author.avatarURL)
            .setDescription(`View ${user.name}'s profile [here](${user.nitroTypeLink})`)
            .addField('Balance', `$**${format.currency(user.balance)}**`)
            .addField('Daily Streak', `**${user.dailyStreak}** day${user.dailyStreak > 1 ? 's' : ''}`)
            .addField('Highest Bet', `$**${format.currency(user.highestBet.amount)}**`, true)
            .addField('Chance', `**${user.highestBet.chance}**%`, true)
    } else {
        profileEmbed
            .setColor(config.colors.red)
            .setAuthor(`Unknown Profile`, msg.author.avatarURL)
            .setDescription('This user does not have an account!')
    }

    return msg.channel.send(profileEmbed)

}

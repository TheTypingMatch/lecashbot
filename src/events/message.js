const User = require('../models/user.model')
const reward = require('../utils/reward')
const checkErr = require('../utils/checkErr')

module.exports = async (client, msg) => {
    const { content, author, reply } = msg
    const { logger, msgCooldowns, config } = client
    const userId = author.id

    // Handle command arguments
    const args = content.slice(config.prefix.length).trim().split(/ +/g)
    const cmd = args.shift().toLowerCase()
    const generalCmds = ['help', 'register', 'total', 'leaderboard', 'ping', 'faq']

    if (author.bot) return

    // Check if the user has an account.
    const user = await User.findOne({ discordId: userId })
    if (user) {
        if (user.name !== author.username) {
            const updatedName = { name: author.username }
            User.updateOne({ discordId: userId }, updatedName, err => {
                checkErr(err, client, () => {
                    logger.log(`Updated username ${user.name} to ${author.username}`, 'ready')
                })
            })
        }

        // Add user to msg reward cooldown
        if (!user.banned && !msgCooldowns.includes(userId)) {
            reward(userId, client)
        }

        if (user.banned) {
            return reply('You have been banned from the bot.')
        }
    }
    msgCooldowns.push(userId)

    if (!content.startsWith(config.prefix)) return
    if (!user && !generalCmds.includes(cmd)) {
        return reply('You must `$register` an account before using any other commands!')
    }

    // Command handler
    require('../commands.js').run(cmd, msg, client, args)
}

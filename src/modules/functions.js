const User = require('../models/user.model')
const log = require('../utils/log')
const { toHours } = require('../utils/date')
const { devMode } = require('../config/config')

module.exports = (client) => {
    setTimeout(client.refreshActivity = () => {
        client.logger.log('Updating presence...', 'log')
        const { users, guilds } = client
        client.user.setPresence({
            game: {
                name: devMode ? 'In Development' : `${users.size} users, ${guilds.size} servers`,
                type: devMode ? 'PLAYING' : 'WATCHING'
            },
            status: devMode ? 'dnd' : 'online'
        })
        client.logger.log('Done updating presence.', 'ready')
    }, 60 * 1000)
    setTimeout(client.resetDailyStreak = async () => {
        client.logger.log('Checking dailies...', 'log')
        const activeUsers = await User.find({ banned: false })
        if (!activeUsers) return

        activeUsers.forEach(user => {
            const { cooldowns, discordId, dailyStreak, name } = user
            const notCollected = (toHours(new Date() - cooldowns.daily) > 36)
            const userId = { discordId: discordId }

            if (notCollected && dailyStreak) {
                User.updateOne(userId, { dailyStreak: 0 }, err => {
                    if (err) log('error', err, client)
                    else console.log(`Daily Streak reset for user ${name}`)
                })
            }
        })
        client.logger.log('Done checking dailies.', 'ready')
    }, 60 * 1000)
}

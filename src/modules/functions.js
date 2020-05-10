const User = require('../models/user.model')
const log = require('../utils/log')
const { toHours } = require('../utils/date')
const { dailyReset } = require('../config/cooldowns')
const { devMode } = require('../config/config')

module.exports = (client) => {
    setTimeout(client.refreshActivity = () => {
        const { users, guilds } = client
        client.user.setPresence({
            activity: {
                name: devMode ? 'In Development' : `${users.cache.size} users, ${guilds.cache.size} servers`,
                type: devMode ? 'PLAYING' : 'WATCHING'
            },
            status: devMode ? 'dnd' : 'online'
        })
    }, 60 * 60 * 1000)
    setTimeout(client.resetDailyStreak = async () => {
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
    }, dailyReset)
}

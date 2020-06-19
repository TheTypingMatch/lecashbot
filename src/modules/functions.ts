import { User } from '../models/user.model'
import { log } from '../utils/log'
import { toHours } from '../utils/date'
import { devMode } from '../config/config'

const functions = (client: any) => {
    setInterval(client.refreshActivity = () => {
        client.logger.log('Updating presence...', 'log')
        client.user.setPresence({ 
            activity: {
                type: 'WATCHING', 
                name: `${client.users.cache.size} users, ${client.guilds.cache.size} servers`
            }, 
            status: 'online'
        })
        client.logger.log('Done updating presence.', 'ready')
    }, 60 * 1000)
    setInterval(client.resetDailyStreak = async () => {
        client.logger.log('Checking dailies...', 'log')
        const activeUsers: [] = await User.find({ banned: false })
        if (!activeUsers) return

        activeUsers.forEach((user: any) => {
            const { cooldowns, discordId, dailyStreak, name } = user
            const notCollected: boolean = (toHours(new Date().getTime() - cooldowns.daily) > 36)
            const userId: { discordId: string } = { discordId: discordId }

            if (notCollected && dailyStreak) {
                User.updateOne(userId, { dailyStreak: 0 }, err => {
                    if (err) log('error', err, client)
                    else client.logger.log(`Daily Streak reset for user ${name}`, 'ready')
                })
            }
        })
        client.logger.log('Done checking dailies.', 'ready')
    }, 60 * 1000)
}

export { functions }

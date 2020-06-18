import { msgCooldown } from '../config/cooldowns'

module.exports = async client => {
    const {
        resetDailyStreak, users,
        refreshActivity, logger,
        msgCooldowns, guilds, user
    } = client
    const readyMsg = `${user.username} is ready: ${users.cache.size} users, ${guilds.cache.size} servers.`

    resetDailyStreak()
    refreshActivity()
    setInterval(() => msgCooldowns.splice(0, msgCooldowns.length), msgCooldown)
    logger.ready(readyMsg)
}

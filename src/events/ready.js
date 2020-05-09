const { msgCooldown } = require('../config/cooldowns')

module.exports = async client => {
    setInterval(() => client.msgCooldowns.splice(0, client.msgCooldowns.length), msgCooldown)
    client.resetDailyStreak()
    client.refreshActivity()
    client.logger.ready(`${client.user.username} is ready playing with ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`)
}

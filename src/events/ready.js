const { msgCooldown } = require('../../config/cooldowns')

module.exports = async client => {
    setInterval(() => msgCooldowns = [], msgCooldown)
    client.resetDailyStreak()
    client.refreshActivity()
    client.logger.ready(`${client.user.username} is ready playing with ${client.users.size} users in ${client.guilds.size} servers.`)
}
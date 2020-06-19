const fs = require('fs')
const path = require('path')
const User = require('./models/user.model')
const { colors, version } = require('./config/config')
const { MessageEmbed } = require('discord.js')

const cooldownEmbed = new MessageEmbed()
    .setColor(colors.yellow)
    .setAuthor('Cooldown')
    .setTimestamp(new Date())
    .setFooter(`LeCashBot v${version}`)
    .setDescription('A little too quick there!')

module.exports = {
    run: async (cmd, msg, client, args) => {
        const cmdPath = path.join(__dirname, `./commands/${cmd}.js`)
        const devPath = path.join(__dirname, `./commands/dev/${cmd}.js`)
        const adminPath = path.join(__dirname, `./commands/admin/${cmd}.js`)

        const userId = { discordId: msg.author.id }
        const user = await User.findOne({ discordId: msg.author.id })

        if (user) {
            if (user.cmdCooldown && new Date() - user.cmdCooldown < 3000) {
                return msg.channel.send(cooldownEmbed)
            } else {
                User.updateOne(userId, { cmdCooldown: new Date() }, err => {
                    if (err) {
                        client.logger.log('Error updating user cooldown.', 'error')
                    }
                })
            }
        }

        const hasAdminPerms = (fs.existsSync(adminPath) && user.admin)
        const hasDevPerms = (fs.existsSync(devPath) && user.dev)

        if (hasDevPerms) require(devPath)(msg, client, args)
        else if (hasAdminPerms) require(adminPath)(msg, client, args)
        else if (fs.existsSync(cmdPath)) require(cmdPath)(msg, client, args)
    }
}

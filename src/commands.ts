import fs = require('fs')
import path = require('path')
import { User } from './models/user.model'
import { colors, version } from './config/config'
import { MessageEmbed } from 'discord.js'

const cooldownEmbed = new MessageEmbed()
    .setColor(colors.yellow)
    .setAuthor('Cooldown')
    .setTimestamp(new Date())
    .setFooter(`LeCashBot v${version}`)
    .setDescription('A little too quick there!')

const run = async (cmd: string, msg, client, args: string[]) => {
    const userId: { discordId: string } = { discordId: msg.author.id }
    const user: any = await User.findOne({ discordId: msg.author.id })
    const generalPath: string = path.resolve(`./build/commands/${cmd}.js`)
    const adminPath: string = path.resolve(`./build/commands/admin/${cmd}.js`)
    const hasAdminPerms: boolean = (fs.existsSync(adminPath) && user?.admin)

    if (user) {
        if (user.cmdCooldown && new Date().getTime() - user.cmdCooldown < 3000) {
            return msg.channel.send(cooldownEmbed)
        } else {
            User.updateOne(userId, { cmdCooldown: new Date() }, err => {
                if (err) {
                    client.logger.log('Error updating user cooldown.', 'error')
                }
            })
        }
    }

    if (hasAdminPerms) {
        const adminCMD = await import(`./commands/admin/${cmd}`)
        return adminCMD.default(msg, client, args)
    } else if (fs.existsSync(generalPath)) {
        const generalCMD = await import(`./commands/${cmd}`)
        return generalCMD.default(msg, client, args)
    }
}

export { run }

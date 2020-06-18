import fs = require('fs')
import path = require('path')
import { User } from './models/user.model'

const run = async (cmd: string, msg, client, args: string[]) => {
    const user: any = await User.findOne({ discordId: msg.author.id })
    const generalPath: string = path.resolve(`./build/commands/${cmd}.js`)
    const adminPath: string = path.resolve(`./build/commands/admin/${cmd}.js`)
    const hasAdminPerms: boolean = (fs.existsSync(adminPath) && user.admin)

    if (hasAdminPerms) {
        const adminCMD = await import(`./commands/admin/${cmd}`)
        return adminCMD.default(msg, client, args)
    } else if (fs.existsSync(generalPath)){
        const generalCMD = await import(`./commands/${cmd}`)
        return generalCMD.default(msg, client, args)
    }
}

export { run }

const fs = require('fs')
const path = require('path')
const User = require('./models/user.model')

const createAbsolutePath = relativePath => path.join(__dirname, relativePath)

module.exports = {
    run: async (cmd, msg, client, args) => {
        const cmdPath = createAbsolutePath(`./commands/${cmd}.js`)
        const devPath = createAbsolutePath(`./commands/dev/${cmd}.js`)
        const adminPath = createAbsolutePath(`./commands/admin/${cmd}.js`)

        const user = await User.findOne({ discordId: msg.author.id })

        const hasAdminPerms = (fs.existsSync(adminPath) && user.admin)
        const hasDevPerms = (fs.existsSync(devPath) && user.dev)

        if (hasDevPerms) require(devPath)(msg, client, args)
        else if (hasAdminPerms) require(adminPath)(msg, client, args)
        else if (fs.existsSync(cmdPath)) require(cmdPath)(msg, client, args)
    }
}

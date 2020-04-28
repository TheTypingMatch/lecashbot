const fs = require('fs')
const path = require('path')
const User = require('./models/user.model')

module.exports = {
  run: async (cmd, msg, client, args) => {
    const cmdPath = path.join(__dirname, `./commands/${cmd}.js`)
    const devPath = path.join(__dirname, `./commands/dev/${cmd}.js`)
    const adminPath = path.join(__dirname, `./commands/admin/${cmd}.js`)

    const isDev = await User.findOne({ discordId: msg.author.id })
    const isAdmin = await User.findOne({ discordId: msg.author.id })

    const hasAdminPerms = (fs.existsSync(adminPath) && isAdmin.admin)
    const hasDevPerms = (fs.existsSync(devPath) && isDev.dev)

    if (hasDevPerms) require(devPath)(msg, client, args)
    else if (hasAdminPerms) require(adminPath)(msg, client, args)
    else if (fs.existsSync(cmdPath)) require(cmdPath)(msg, client, args)
  }
}

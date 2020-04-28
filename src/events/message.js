const User = require('../models/user.model')
const reward = require('../utils/reward')

module.exports = async (client, msg) => {
  const userId = msg.author.id

  // Handle command arguments
  const args = msg.content.slice(client.config.prefix.length).trim().split(/ +/g)
  const cmd = args.shift().toLowerCase()
  const generalCmds = ['help', 'register', 'total', 'leaderboard', 'ping', 'faq']

  if (msg.author.bot) return

  // Check if the user has an account.
  const user = await User.findOne({ discordId: userId })

  // Updates user name/discriminator in DB
  if (user && user.name !== msg.author.username) {
    const updatedName = { name: msg.author.username }
    User.updateOne({ discordId: userId }, updatedName, err => checkErr(err, client, () => {
      console.log(`Updated username ${user.name} to ${msg.author.username}`)
    }))
  }

  // Add user to msg reward cooldown
  if (user && !user.banned && !client.msgCooldowns.includes(userId)) reward(userId, client)
  client.msgCooldowns.push(userId)

  // Check if the msg starts with a prefix
  if (!msg.content.startsWith(client.config.prefix)) return

  if (!user && !generalCmds.includes(cmd)) { return msg.reply('You must `$register` an account before using any other commands!') }

  if (user && user.banned) return msg.reply('You have been banned from the bot.')

  // Command handler
  require('../commands.js').run(cmd, msg, client, args)
}

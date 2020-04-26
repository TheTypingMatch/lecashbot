const User = require('../models/user.model')

module.exports = async (client, message) => {
    const userId = message.author.id
    
    // Handle command arguments
    const args = message.content.slice(client.prefix.length).trim().split(/ +/g)
    const cmd = args.shift().toLowerCase()
    const generalCmds = ['help', 'register', 'total', 'leaderboard', 'ping', 'faq']
    
    if (message.author.bot) return

    // Check if the user has an account.
    const user = await User.findOne({ discordId: userId })

    // Updates user name/discriminator in DB
    if (user && user.name !== message.author.username) {
        const updatedName = { name: message.author.username }
        User.updateOne({ discordId: userId }, updatedName, err => checkErr(err, client, () => {
            console.log(`Updated username ${user.name} to ${message.author.username}`)
        }))
    }
    
    // Add user to message reward cooldown
    if (user && !user.banned && !client.messageCooldowns.includes(userId)) reward(userId, client)
    client.messageCooldowns.push(userId)

    // Check if the message starts with a prefix
    if (!message.content.startsWith(client.prefix)) return
    
    if (!user && !generalCmds.includes(cmd)) 
        return message.reply('You must `$register` an account before using any other commands!')

    if (user && user.banned) return message.reply('You have been banned from the bot.')

    // Command handler
    require('./src/commands').run(cmd, message, client, args)
}
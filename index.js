const Discord = require('discord.js')
require('dotenv').config()

// Models
const User = require('./src/models/user.model')

// config
const { prefix, db, devMode, token } = require('./config/config')
const { msgCooldown, dailyReset } = require('./config/cooldowns')

// utils
const log = require('./src/utils/log')
const reward = require('./src/utils/reward')
const { toHours } = require('./src/utils/date')
const checkErr = require('./src/utils/checkErr')

const client = new Discord.Client({
    disableEveryone: true, 
    fetchAllMembers: true, 
    sync: true
})

// database connection
const mongoDB = require('mongodb')
const mongoose = require('mongoose')

mongoDB.connect(db.uri, db.uriParams, err => {
    if (err) log('error', err, client)
    else console.log('Successfully connected to database.')
})

mongoose.connect(db.uri, db.uriParams, err => {
    if (err) log('error', err, client)
})

const refreshActivity = () => {
    const { users, guilds } = client
    client.user.setPresence({
        game: {
            name: devMode ? 'In Development' : `${users.size} users, ${guilds.size} servers`,
            type: devMode ? 'PLAYING' : 'WATCHING'
        },
        status: devMode ? 'dnd' : 'online'
    })
}

const resetDailyStreak = async () => {

    const activeUsers = await User.find({ banned: false })
    if (!activeUsers) return

    activeUsers.forEach(user => {

        const { cooldowns, discordId, dailyStreak, name } = user
        const notCollected = (toHours(new Date() - cooldowns.daily) > 36)
        const userId = { discordId: discordId }

        if (notCollected && dailyStreak) {
            User.updateOne(userId, { dailyStreak: 0 }, err => {
                if (err) log('error', err, client)
                else console.log(`Daily Streak reset for user ${name}`)
            })
        }

    })

}

let msgCooldowns = []

client.on('ready', () => {
    setInterval(() => msgCooldowns = [], msgCooldown)
    setInterval(resetDailyStreak, dailyReset)
    refreshActivity()
})

client.on('guildCreate', () => refreshActivity())
client.on('guildRemove', () => refreshActivity())
client.on('guildMemberAdd', () => refreshActivity())
client.on('guildMemberRemove', () => refreshActivity())

client.on('message', async msg => {

    const userId = msg.author.id
    
    // Handle command arguments
    const args = msg.content.slice(prefix.length).trim().split(/ +/g)
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
    
    // Add user to message reward cooldown
    if (user && !user.banned && !msgCooldowns.includes(userId)) reward(userId, client)
    msgCooldowns.push(userId)

    // Check if the message starts with a prefix
    if (!msg.content.startsWith(prefix)) return
    
    if (!user && !generalCmds.includes(cmd)) 
        return msg.reply('You must `$register` an account before using any other commands!')

    if (user && user.banned) return msg.reply('You have been banned from the bot.')

    // Command handler
    require('./src/commands').run(cmd, msg, client, args)
    
})

client.login(token)
    .then(() => console.log('Successfully logged in.'))
    .catch(err => log('error', err, client))

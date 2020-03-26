const Discord = require('discord.js')
const fs = require('fs')
const dotenv = require('dotenv')

// Models
const User = require('./src/models/user.model')

dotenv.config()

// config
const config = require('./config/config')
const cooldowns = require('./config/cooldowns')

// utils
const log = require('./src/utils/log')
const reward = require('./src/utils/reward')
const date = require('./src/utils/date')

const prefix = config.prefix
const client = new Discord.Client({
    disableEveryone: true, 
    fetchAllMembers: true, 
    sync: true
})

// database connection
const mongoDB = require('mongodb')
const mongoose = require('mongoose')

mongoDB.connect(config.db.uri, config.db.uriParams)
    .then(() => console.log('Successfully connected to database.'))
    .catch(err => log('error', err, client))

mongoose.connect(config.db.uri, config.db.uriParams)
    .catch(err => log('error', err, client))

const refreshActivity = () => {
    client.user.setPresence({
        game: {
            name: config.devMode ? 'In Development' : `${client.users.size} users on Nitro Type`,
            type: config.devMode ? 'PLAYING' : 'WATCHING'
        },
        status: config.devMode ? 'dnd' : 'online'
    })
}

const resetDailyStreak = async () => {

    const activeUsers = await User.find({ banned: false })
    let dailiesReset = 0
    activeUsers.forEach(user => {
        const cooldown = user.cooldowns.daily
        const notCollected = (date.toHours(new Date()) - date.toHours(cooldown) > 36)
        if (notCollected && user.dailyStreak) {
            dailiesReset += 1
            User.update({ discordId: user.discordId }, { dailyStreak: 0 }, err => {
                log('error', err, client)
            })
        }
        console.log(`${dailiesReset} users' daily streaks have been reset.`)
    })

}

client.on('ready', () => {
    refreshActivity()
    setInterval(resetDailyStreak, cooldowns.dailyReset)
})

// Command handler

client.on('guildCreate', () => refreshActivity())
client.on('guildRemove', () => refreshActivity())
client.on('guildMemberAdd', () => refreshActivity())
client.on('guildMemberRemove', () => refreshActivity())

let msgCooldowns = []

// msg reward cooldown
setInterval(() => {
    msgCooldowns = []
}, cooldowns.msgCooldown)

client.on('message', async msg => {

    const userId = msg.author.id
    
    // Handle commands
    const args = msg.content.slice(prefix.length).trim().split(/ +/g)
    const cmd = args.shift().toLowerCase()
    const generalCmds = ['help', 'register', 'total', 'leaderboard', 'ping', 'faq', 'event']
    
    // Check if the user is a bot
    if (msg.author.bot) return
    
    // DM handler

    // Check if the user has an account.
    const user = await User.findOne({
        discordId: userId
    })
    
    // Add user to message reward cooldown
    if (!msgCooldowns.includes(userId) && user)
        reward(userId, client)

    msgCooldowns.push(userId)

    // Check if the message starts with a prefix
    if (!msg.content.startsWith(prefix)) return
    
    if (!user && !generalCmds.includes(cmd))
        return msg.reply('You must `$create` an account before using any other commands!')

    // Check if the user is banned
    if (user && user.banned) 
        return msg.reply('You have been banned from the bot.')

    /*

        Check if the...
        [x] user is a bot
        [x] message starts with a prefix
        [x] user has an account
        [x] user is banned
        [ ] user has developer permissions
    
    */

    const commands = require('./src/commands')
    commands.run(cmd, msg, client, args)
    
})

client.login(config.token)
    .then(() => console.log('Successfully logged in.'))
    .catch(err => log('error', err, client))

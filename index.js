const Discord = require('discord.js')
const fs = require('fs')
const dotenv = require('dotenv')

dotenv.config()

// config
const config = require('./config/config')
const cooldowns = require('./config/cooldowns')

// utils
const log = require('./src/utils/log')

// database connection
const mongoDB = require('mongodb')
const mongoose = require('mongoose')

mongoDB.connect(config.db.uri, config.db.uriParams)
    .then(() => console.log('Successfully connected to database.'))
    .catch(err => log('error', err))

mongoose.connect(config.db.uri, config.db.uriParams)
    .catch(err => log('error', err))

const prefix = config.prefix
const client = new Discord.Client({
    disableEveryone: true, 
    fetchAllMembers: true, 
    sync: true
})

const refreshActivity = () => {
    client.user.setPresence({
        game: {
            name: config.devMode ? 'In Development' : `${client.users.size} users on Nitro Type`,
            type: config.devMode ? 'PLAYING' : 'WATCHING'
        },
        status: config.devMode ? 'dnd' : 'online'
    })
}

client.on('ready', () => {
    refreshActivity()
    // Autobackup profile interval
})

// Command handler

client.on('guildCreate', () => refreshActivity())
client.on('guildRemove', () => refreshActivity())
client.on('guildMemberAdd', () => refreshActivity())
client.on('guildMemberRemove', () => refreshActivity())

client.on('message', msg => {
    
    if (msg.author.bot)
        return
    
    // DM handler

    if (!msg.content.startsWith(prefix))
        return
    
    /*

        1. Check if the user is a bot
        2. Check if the message starts with a prefix
        3. Check if the user is banned
        4. Check if the user has developer permissions
        5. Check if the user has an account

    */
    
    // Handle commands
    const args = msg.content.slice(prefix.length).trim().split(/ +/g)
    const cmd = args.shift().toLowerCase()

    const commands = require('./src/commands')
    commands.run(cmd, msg, client, args)
    
})

client.login(config.token)
    .then(() => console.log('Successfully logged in.'))
    .catch(err => log('error', err))

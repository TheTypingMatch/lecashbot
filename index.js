const Discord = require('discord.js')
const log = require('./src/utils/log')

const client = new Discord.Client({
    disableEveryone: true, 
    fetchAllMembers: true, 
    sync: true
})

require('dotenv').config()
require('./src/modules/functions.js')(client)

client.config = require('./config/config.js')
client.loader = require('./src/modules/Loader')
client.msgCooldowns = []

const mongoDB = require('mongodb')
const mongoose = require('mongoose')
const uri = process.env.URI
const uriParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
} 

const initDatabase = () => {
    mongoDB.connect(uri, uriParams, err => {
        if (err) log('error', err, client)
        else client.logger.log('Successfully connected to database.')
    })
    
    mongoose.connect(uri, uriParams, err => {
        if (err) log('error', err, client)
    })
}

const init = async () => {
    console.clear()
    const loader = client.loader
    await loader.registerModules(client)
    await loader.registerEvents(client)
    await loader.checkDiscordStatus(client)
    await initDatabase()
    await client.login(process.env.TOKEN)
}

init()
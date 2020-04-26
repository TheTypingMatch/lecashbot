const Discord = require('discord.js')

const client = new Discord.Client({
    disableEveryone: true, 
    fetchAllMembers: true, 
    sync: true
})

require('dotenv').config()
require('./src/modules/functions.js')(client)

client.loader = require('./src/modules/Loader')

const mongoDB = require('mongodb')
const mongoose = require('mongoose')
const db = undefined

const initDatabase = () => {
    if (db === undefined)
        return client.logger.warn('There was a problem connecting to the database. Ignoring..')

    mongoDB.connect(db.uri, db.uriParams, err => {
        if (err) log('error', err, client)
        else client.logger.log('Successfully connected to database.')
    })
    
    mongoose.connect(db.uri, db.uriParams, err => {
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
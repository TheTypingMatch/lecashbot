const User = require('../models/user.model')
const log = require('../utils/log')
const fetch = require('node-fetch')
const checkErr = require('../utils/checkErr')

const urlExists = async url => {
    return await fetch(url)
        .then(res => res.text())
        .then(res => res.includes('RACER_INFO'))
        .catch(err => checkErr(err))
}

const register = (msg, ntLink) => {
    const user = new User({
        date: new Date(),
        name: msg.author.username,
        nitroTypeLink: ntLink,
        discordId: msg.author.id,
        discordTag: msg.author.tag
    })
    user.save(err => {
        if (err) {
            log('error', err, client)
            return msg.reply('Error creating account. Contact a LeCashBot dev!')
        } else return msg.reply('Success! See `$help` for information on commands')
    })
}

module.exports = async (msg, client, args) => {
    if (!args[0]) {
        return msg.reply('Use your NitroType username (NOT display name): Use `$register USERNAME`')
    }

    // Check if the user already has an account
    const userExists = await User.findOne({
        discordId: msg.author.id
    })

    if (userExists) return msg.reply('You already have an account!')

    // Check if someone is already registered with this NitroType link
    const linkExists = await User.findOne({ nitroTypeLink: args[0] })
    if (linkExists) {
        return msg.reply('Someone is already registered with this account!')
    }

    const link = (args[0].includes('nitrotype.com/racer/'))
        ? args[0]
        : `https://www.nitrotype.com/racer/${args[0]}`

    const ntLinkExists = await urlExists(link)
    return (ntLinkExists)
        ? register(msg, link)
        : msg.reply('Invalid NitroType profile link!')
}

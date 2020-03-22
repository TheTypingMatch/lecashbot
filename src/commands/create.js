const User = require('../models/user.model')

const validateLink = link => {
    return true
}

module.exports = (msg, client, args) => {
    const ntLink = args[0]
    if (validateLink(ntLink)) {
        const user = new User({
            date: new Date(),
            name: msg.author.username, 
            nitroTypeLink: ntLink, 
            discordId: msg.author.id,
            discordTag: msg.author.tag
        })
        user.save()
            .then(() => {
                msg.reply('Success!')
            }).catch(err => {
                msg.reply('Error!')
            })
    }
}

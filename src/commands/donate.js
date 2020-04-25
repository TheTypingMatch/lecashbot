const User = require('../models/user.model')
const { RichEmbed } = require('discord.js')
const { colors, version } = require('../../config/config')
const { donateLink, donors } = require('../../config/embeds').donate
const { currency } = require('../utils/format')

const getDonors = async () => {
    const donors = await User.find({ donor: true })
    return donors.map(donor => ({
        name: donor.name, 
        amount: donor.donations
    }))
}

const addField = userData => {

    userData.sort((a, b) => {
        const aAmount = a.amount
        const bAmount = b.amount
        return (aAmount > bAmount) ? 1 : ((bAmount > aAmount) ? -1 : 0)
    }).reverse()

    return `${userData.map(user => `**${user.name}** - \`$${currency(user.amount || 0)}\`\n`)}`.replace(/\n,/g, '\n')

}

module.exports = async (msg, client, args) => {

    const donors = await getDonors()

    let donateEmbed = new RichEmbed()
        .setColor(colors.green)
        .setAuthor('Donate', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(donateLink)
        .addField('Donors', addField(donors))

    return msg.channel.send(donateEmbed)

}

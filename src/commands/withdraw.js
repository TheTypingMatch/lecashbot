const User = require('../models/user.model')
const checkErr = require('../utils/checkErr')
const { RichEmbed } = require('discord.js')
const { colors, version } = require('../../config/config')
const { currency, int } = require('../utils/format')

let statusColor = colors.yellow
let message = ''

const withdraw = (client, msg, user, amount, notifEmbed) => {
    User.updateOne({ discordId: msg.author.id }, {
        balance: user.balance - amount
    }, err => checkErr(err, client, () => {
        statusColor = colors.red
        message = 'An error occurred.'
    }))
    client.users.get('296862365503193098').send(notifEmbed)
}

module.exports = async (msg, client, args) => {

    if (!args[0] || !int(args[0])) return msg.reply('No amount given. Use `$withdraw <amount>`.')

    const amount = int(args[0])
    const userId = { discordId: msg.author.id }
    const user = await User.findOne(userId)
    const userBal = user.balance
    
    message = `You have withdrawn $**${currency(amount)}**. It will be sent to your NitroType account soon.`

    let notifEmbed = new RichEmbed()
        .setColor(colors.green)
        .setAuthor('Withdraw', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(`$**${currency(amount)}** withdrawn to [${user.name}](${user.nitroTypeLink}).`)

    if (userBal < 100000) message = 'You do not have enough money to withdraw: $**100,000** minimum'
    else if (userBal < amount) message = `You do not have enough cash: $**${currency(userBal)}**`
    else if (amount < 100000) message = 'You must withdraw at least $**100,000**.'
    else {
        withdraw(client, msg, user, amount, notifEmbed)
        statusColor = colors.green
    }

    let withdrawEmbed = new RichEmbed()
        .setColor(statusColor)
        .setAuthor('Withdraw', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(message)

    return msg.channel.send(withdrawEmbed)

}

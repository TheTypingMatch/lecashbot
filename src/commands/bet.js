const User = require('../models/user.model')
const { RichEmbed } = require('discord.js')
const { colors, version } = require('../../config/config')
const { currency, int } = require('../utils/format')
const log = require('../utils/log')

const sendRecordEmbed = (msg, previousBet) => {

    let recordBetEmbed = new RichEmbed()
        .setColor(colors.green)
        .setAuthor('New Highest Bet!', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(`Previous best: $**${currency(previousBet)}**`)

    msg.channel.send(recordBetEmbed)

}

const sendBetEmbed = (msg, bet, didWin) => {

    let betEmbed = new RichEmbed()
        .setColor(didWin[0] ? colors.green : colors.red)
        .setAuthor('Bet', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(`You ${(didWin[0]) ? 'won' : 'lost'} $**${currency(bet)}**.`)
        .addField('Chances', `**${didWin[1]}**%`)

    msg.channel.send(betEmbed)

}

const getHighestBet = async msg => {
    
    const user = await User.findOne({ discordId: msg.author.id })
    const bestBet = user.highestBet
    const message = `Your highest bet is $**${currency(bestBet.amount)}** with a chance of **${bestBet.chance}**%.`
    
    return msg.channel.send(message)

}

const win = bet => {

    const chances = Math.round((750 / (bet - 200)) + (750 / Math.sqrt(bet)) * 100) / 100 + 5
    const randomNum = Math.random() * 100

    return [(randomNum < chances) ? true : false, chances]
    
}

const makeBet = async (msg, user, bet) => {

    const didWin = win(bet)
    sendBetEmbed(msg, bet, didWin)

    const previousBet = user.highestBet.amount
    const previousBal = user.balance
    const userId = { discordId: msg.author.id }
    const newBal = {
        balance: (didWin[0]) ? (previousBal + bet) : (previousBal - bet)
    }

    if (previousBet < bet && didWin[0]) {
        User.updateOne(userId, {
            highestBet: {
                chance: didWin[1], 
                amount: bet
            }
        }, err => err ? log('error', err, client) : sendRecordEmbed(msg, previousBet))
    }
    
    User.updateOne(userId, newBal, err => {
        if (err) log('error', err, client)
    })

}

module.exports = async (msg, client, args) => {

    if (!args[0] || !int(args[0])) return msg.reply('Undefined bet amount: Use `$bet <amount>`.')
    if (args[0] == 'high') return getHighestBet(msg)

    const bet = int(args[0])

    // Make sure the bet is at least $250
    if (bet < 250) return msg.reply('Bets must be at least $250!')

    // Fetch the user from db
    const user = await User.findOne({ discordId: msg.author.id })
    if (!user) return msg.channel.send('An error occurred.')

    // Check if the user has enough in their balance to bet.
    return (user.balance >= bet) ? makeBet(msg, user, bet) : msg.reply(`Insufficient bal: $${user.balance}`)

}

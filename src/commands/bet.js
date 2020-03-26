const Discord = require('discord.js')
const User = require('../models/user.model')
const cooldowns = require('../../config/cooldowns')
const config = require('../../config/config')
const date = require('../utils/date')
const log = require('../utils/log')

const sendRecordEmbed = (msg, previousBet) => {

    let recordBetEmbed = new Discord.RichEmbed()
        .setColor(config.colors.green)
        .setAuthor('New Highest Bet!', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${config.version}`)
        .setDescription(`Previous best: $**${previousBet}**`)

    msg.channel.send(recordBetEmbed)

}

const sendBetEmbed = (msg, bet, didWin) => {

    let betEmbed = new Discord.RichEmbed()
        .setColor(didWin[0] ? config.colors.green : config.colors.red)
        .setAuthor('Bet', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${config.version}`)
        .setDescription(`You ${(didWin[0]) ? 'won' : 'lost'} $**${bet}**.`)
        .addField('Chances', `**${didWin[1]}**%`)

    msg.channel.send(betEmbed)

}

const getHighestBet = async msg => {
    
    const user = await User.findOne({ discordId: msg.author.id })
    const bestBet = user.highestBet
    const message = `Your highest bet is $**${bestBet.amount}** with a chance of **${bestBet.chance}**%.`
    
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
        }, err => err ? log('error', err) : sendRecordEmbed(msg, previousBet))
    }
    
    User.updateOne(userId, newBal, err => {
        if (err) log('error', err)
    })

}

module.exports = async (msg, client, args) => {

    if (args[0] == 'high') return getHighestBet(msg)
    if (!args[0]) return msg.reply('Undefined bet amount: Use `$bet <amount>`.')

    const bet = parseInt(args[0])

    // Make sure the bet is at least $250
    if (bet < 250) return msg.reply('Bets must be at least $250!')

    // Fetch the user from db
    const user = await User.findOne({ discordId: msg.author.id })
    if (!user) return msg.channel.send('An error occurred.')

    // Check if the user has enough in their balance to bet.
    if (user.balance >= bet) 
        return makeBet(msg, user, bet)
    return msg.reply(`You do not have enough in your balance: $${user.balance}`)

}

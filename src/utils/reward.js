const User = require('../models/user.model')
const log = require('../utils/log')

const reward = async (userId, client) => {

    const randReward = Math.floor(Math.random() * 50 + 50)
    const user = await User.findOne({ discordId: userId })

    if (!user) 
        return log('error', `User not found: ${user}`)

    const userBalance = user.balance
    User.updateOne({ discordId: userId }, { 
        balance: userBalance + randReward
    }, err => {
        if (err) log('error', err, client)
    })

    return log('cash', `**${user.name}** earned $**${randReward}**.`, client)

}

module.exports = reward

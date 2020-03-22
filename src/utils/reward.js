const User = require('../models/user.model')

const reward = async userId => {
    const randReward = Math.floor(Math.random() * 50 + 50)
    const user = await User.findOne({
        discordId: userId
    })
    const userBalance = user.balance
    User.updateOne({
        discordId: userId
    }, {
        balance: userBalance + randReward
    }, err => console.log(err ? err : `User ${userId} just earned $${randReward}.`))
}

module.exports = reward

import { User } from '../models/user.model'
import { log } from './log'

const reward = async (userId, client) => {
    let randReward = Math.floor(Math.random() * 50 + 25)
    const user = await User.findOne({ discordId: userId })

    if (!user) return log('error', `User not found: ${user}`, client)
    if (user.donations > 10 ** 8) randReward *= 2

    User.updateOne({ discordId: userId }, {
        balance: user.balance + randReward
    }, err => {
        if (err) log('error', err, client)
    })

    return log('cash', `**${user.name}** earned $**${randReward}**.`, client)
}

export { reward }

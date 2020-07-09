import { User } from '../models/user.model'
import { reward } from '../utils/reward'
import { checkErr } from '../utils/checkErr'
import { run } from '../commands'

module.exports = async (client: any, msg: any) => {
    const { content, author } = msg
    const { logger, msgCooldowns, config } = client
    const userId: string = author.id

    // Handle command arguments
    const args: string[] = content.slice(config.prefix.length).trim().split(/ +/g)
    const cmd: string = args.shift().toLowerCase()
    const generalCmds: string[] = ['help', 'register', 'total', 'leaderboard', 'ping', 'stats', 'faq']

    if (author.bot) return

    // Check if the user has an account.
    const user = await User.findOne({ discordId: userId })
    if (user) {
        if (user.name !== author.username) {
            const updatedName: { name: string } = { name: author.username }
            User.updateOne({ discordId: userId }, updatedName, err => {
                checkErr(err, client, () => {
                    logger.log(`Updated username ${user.name} to ${author.username}`, 'ready')
                })
            })
        }

        if (content.startsWith(config.prefix) && user.banned) {
            return msg.reply('You have been banned from the bot.')
        }

        // Add user to msg reward cooldown
        if (!user.banned && !msgCooldowns.includes(userId)) {
            reward(userId, client)
        }
    }
    msgCooldowns.push(userId)

    if (!content.startsWith(config.prefix)) return
    if (!user && !generalCmds.includes(cmd)) {
        return msg.reply('You must `$register` an account before using any other commands!')
    }

    // Command handler
    run(cmd, msg, client, args)
}

import { User } from '../models/user.model'
import { log } from '../utils/log'
import { toHours } from '../utils/date'
import { Leaderboard } from '../models/leaderboard.model'

const functions = (client: any) => {
    setInterval(client.refreshActivity = () => {
        client.logger.log('Updating presence...', 'log')
        /*client.user.setPresence({ 
            activity: {
                type: 'WATCHING', 
                name: `${client.guilds.cache.size} servers.`
            }, 
            status: 'online'
        })*/
        client.logger.log('Done updating presence.', 'ready')
    }, 5 * 60 * 1000)

    setInterval(client.resetDailyStreak = async () => {
        client.logger.log('Checking dailies...', 'log')
        const activeUsers: [] = await User.find({ banned: false })
        if (!activeUsers) return

        activeUsers.forEach((user: any) => {
            const { cooldowns, discordId, dailyStreak, name } = user
            const notCollected: boolean = (toHours(new Date().getTime() - cooldowns.daily) > 36)
            const userId: { discordId: string } = { discordId: discordId }

            if (notCollected && dailyStreak) {
                User.updateOne(userId, { dailyStreak: 0 }, err => {
                    if (err) log('error', err, client)
                    else client.logger.log(`Daily Streak reset for user ${name}`, 'ready')
                })
            }
        })
        client.logger.log('Done checking dailies.', 'ready')
    }, 5 * 60 * 1000)

    setInterval(client.updateLeaderboards = async () => {
        const users: any = await User.find({ banned: false })

        ['streak', 'balance', 'coinflip', 'bet'].forEach(leaderboardType => {
            let newLeaderboard = sortLeaderboard(users, type)
            
            await Leaderboard.updateOne({ __v: 0 }, {
                [leaderboardType]: newLeaderboard
            })

            log('ready', `Updated ${leaderboardType} leaderboard.`);
        })
    }, 5 * 60 * 1000)
}

const sortLeaderboard = type => {
    const sortedUsers: any = sortUsers(users, type)
    const topTen: any = getTopTen(sortedUsers)

    return topTen
}

const getTopTen = (arr: any[]) => arr.slice(-10).reverse()

// The sort type is the property of users that the function sorts by
const sortUsers = (users: any[], sortType: string) => {
    if (sortType === 'bet') {
        return users.sort((a, b) => {
            const aBet: number = a.highestBet.amount
            const bBet: number = b.highestBet.amount
            return (aBet > bBet) ? 1 : ((bBet > aBet) ? -1 : 0)
        })
    }

    if (sortType === 'coinflip') {
        return users.sort((a, b) => {
            const aStreak: number = a.coinflipBestStreak
            const bStreak: number = b.coinflipBestStreak
            return (aStreak > bStreak) ? 1 : ((bStreak > aStreak) ? -1 : 0)
        }).reverse()
    }

    return users.sort((a, b) => {
        return (a[sortType] > b[sortType]) ? 1 : (
            (b[sortType] > a[sortType]) ? -1 : 0
        )
    })
}

export { functions }

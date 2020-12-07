import { User } from '../models/user.model'
import { log } from '../utils/log'
import { toHours } from '../utils/date'
import { Leaderboard } from '../models/leaderboard.model'
import leaderboard from '../commands/leaderboard'

const functions = (client: any) => {
    setInterval(client.refreshActivity = () => {
        client.logger.log('Updating presence...', 'log')
        client.user.setPresence({ 
            activity: {
                type: 'WATCHING', 
                name: `${client.guilds.cache.size} servers.`
            }, 
            status: 'online'
        })
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
        client.logger.log('Updating leaderboards...')
        
        const users: any = await User.find({ banned: false })
        let lbTypes = ['streak', 'balance', 'coinflip', 'bet']
        let leaderboardExists = await Leaderboard.findOne({ version: 1 })
        
        if (!leaderboardExists) {
            return await createLeaderboard(client)
        }

        await lbTypes.forEach(async leaderboardType => {
            client.logger.log(`Updating ${leaderboardType} leaderboard.`);
            let newLeaderboard = getTopTen(sortLeaderboard(users, leaderboardType))
            
            await Leaderboard.updateOne({ version: 1 }, {
                [leaderboardType]: newLeaderboard
            }, async err => {
                if (!err) client.logger.ready(`Updated ${leaderboardType} leaderboard.`)
                
            })
        })
    }, 5 * 60 * 1000)
}

const createLeaderboard = async client => {
    const leaderboard = new Leaderboard({ version: 1 });
    client.logger.ready('Created leaderboard.')

    return await leaderboard.save()
}

const sortLeaderboard = (users, type) => {
    const sortedUsers: any = sortUsers(users, type)
    const topTen: any = getTopTen(sortedUsers)

    return topTen
}

const getTopTen = (arr: any[]) => arr.slice(-10).reverse()

// The sort type is the property of users that the function sorts by
const sortUsers = (users: any[], sortType: string) => {
    if (sortType === 'streak') sortType = 'dailyStreak'
    
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
        })
    }

    return users.sort((a, b) => {
        return (a[sortType] > b[sortType]) ? 1 : (
            (b[sortType] > a[sortType]) ? -1 : 0
        )
    })
}

export { functions }

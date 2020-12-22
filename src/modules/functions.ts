import { User } from '../models/user.model';
import { log } from '../utils/log';
import { toHours } from '../utils/date';
import { Leaderboard } from '../models/leaderboard.model';
import { MessageEmbed } from 'discord.js';
import { currency } from '../utils/format';
import { Lottery } from '../models/lottery.model';
import { colors, version } from '../config/config';

const functions = (client: any) => {
    setInterval(client.refreshActivity = () => {
        client.logger.log('Updating presence...', 'log');
        client.user.setPresence({
            activity: {
                type: 'WATCHING',
                name: `${client.guilds.cache.size} servers.`
            },
            status: 'online'
        });
        client.logger.log('Done updating presence.', 'ready');
    }, 5 * 60 * 1000);

    setInterval(client.resetDailyStreak = async () => {
        client.logger.log('Checking dailies...', 'log');
        const activeUsers: [] = await User.find({ banned: false });
        if (!activeUsers) return;

        activeUsers.forEach((user: any) => {
            const { cooldowns, discordId, dailyStreak, name } = user;
            const notCollected: boolean = (toHours(new Date().getTime() - cooldowns.daily) > 36);
            const userId: { discordId: string } = { discordId: discordId };

            if (notCollected && dailyStreak) {
                User.updateOne(userId, { dailyStreak: 0 }, err => {
                    if (err) log('error', err, client);
                    else client.logger.log(`Daily Streak reset for user ${name}`, 'ready');
                });
            }
        });
        client.logger.log('Done checking dailies.', 'ready');
    }, 5 * 60 * 1000);

    setInterval(client.updateLottery = async () => {
        client.logger.log('Updating lottery...', 'log');
        // check if lottery has ended for daily/weekly/monthly
        // if it has end the lottery by DMing all the users who the winner was and payout to the winner

        const lotteryTypes = ['daily', 'weekly', 'monthly'];
        for (let type of lotteryTypes) {
            const lottery = await Lottery.findOne({ type });

            if (lottery === undefined || lottery === null) {
                await createLottery(type, client);
                continue;
            }

            const timeLeft = subtractDate(lottery.endDate);

            if (timeLeft < 0) {
                await endLottery(client, type);
            }
        }

        client.logger.ready('Done updating lottery.');
    }, 5 * 60 * 1000);

    setInterval(client.updateTotal = async () => {
        client.logger.log('Updating total...');

        const activeUsers = await User.find({ banned: false });
        const userBalances = activeUsers.map((user: any) => user.balance);
        const total: number = userBalances.reduce((t: number, bal: number) => t + bal);

        client.total = total;
    }, 5 * 60 * 1000);

    setInterval(client.updateLeaderboards = async () => {
        client.logger.log('Updating leaderboards...');

        const users: any = await User.find({ banned: false });
        const lbTypes = ['streak', 'balance', 'coinflip', 'bet'];
        const leaderboardExists = await Leaderboard.findOne({ version: 1 });

        if (!leaderboardExists) {
            return await createLeaderboard(client);
        }

        await lbTypes.forEach(async leaderboardType => {
            client.logger.log(`Updating ${leaderboardType} leaderboard.`);
            const newLeaderboard = getTopTen(sortLeaderboard(users, leaderboardType));

            await Leaderboard.updateOne({ version: 1 }, {
                [leaderboardType]: newLeaderboard
            }, async err => {
                if (!err) client.logger.ready(`Updated ${leaderboardType} leaderboard.`);
            });
        });
    }, 5 * 60 * 1000);
};

const createLottery = async (type, client) => {
    const now = new Date();
    let tomorrow = new Date().getTime() + 24 * 60 * 60 * 1000;
    let nextWeek = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
    let nextMonth = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;

    const entryFees = {
        daily: 1000,
        weekly: 5000,
        monthly: 25000
    }

    const endDates = {
        daily: tomorrow,
        weekly: nextWeek,
        monthly: nextMonth
    }

    const newLottery = new Lottery({
        type,
        endDate: new Date(endDates[type]),
        entryFee: entryFees[type]
    });

    newLottery.save();
    client.logger.ready(`Created ${type} lottery.`);
}

const resetLottery = async type => {
    const now = new Date();
    let tomorrow = new Date().getTime() + 24 * 60 * 60 * 1000;
    let nextWeek = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
    let nextMonth = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;

    const endDates = {
        daily: tomorrow,
        weekly: nextWeek,
        monthly: nextMonth
    }

    await Lottery.updateOne({ type }, {
        endDate: new Date(endDates[type]),
        entries: []
    });
}

// capitalize first letter
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const endLottery = async (client, type) => {
    const lottery = await Lottery.findOne({ type });
    const { entries } = lottery;

    if (entries.length === 0) {
        return await resetLottery(type);
    }

    const winnerId = entries[Math.floor(Math.random() * entries.length)];
    const winner = await User.findOne({ discordId: winnerId });
    await User.updateOne({ discordId: winnerId }, {
        balance: winner.balance + (lottery.entryFee * entries.length)
    });

    const winnerEmbed = new MessageEmbed()
        .setAuthor(`${capitalize(type)} Lottery Winner!`)
        .setTimestamp(new Date())
        .setColor(colors.green)
        .setFooter(`LeCashBot v${version}`)
        .addField('Winner', `${winner.name}`)
        .addField('Prize', `$**${currency(lottery.entryFee * entries.length)}**`);
    
    for (let userId of entries) {
        let user = client.users.cache.get(userId);
        
        if (!user) {
            client.logger.error('Unable to send user lottery winner.');
            break;
        }

        user.send(winnerEmbed);
    }

    return resetLottery(type);
}

// calculate time between now and end date
const subtractDate = endDate => {
    const now = new Date();
    return endDate - now.getTime();
}

const createLeaderboard = async client => {
    const leaderboard = new Leaderboard({ version: 1 });
    client.logger.ready('Created leaderboard.');

    return await leaderboard.save();
};

const sortLeaderboard = (users, type) => {
    const sortedUsers: any = sortUsers(users, type);
    const topTen: any = getTopTen(sortedUsers);

    return topTen;
};

const getTopTen = (arr: any[]) => arr.slice(-10).reverse();

// The sort type is the property of users that the function sorts by
const sortUsers = (users: any[], sortType: string) => {
    if (sortType === 'streak') sortType = 'dailyStreak';

    if (sortType === 'bet') {
        return users.sort((a, b) => {
            const aBet: number = a.highestBet.amount;
            const bBet: number = b.highestBet.amount;
            return (aBet > bBet) ? 1 : ((bBet > aBet) ? -1 : 0);
        });
    }

    if (sortType === 'coinflip') {
        return users.sort((a, b) => {
            const aStreak: number = a.coinflipBestStreak;
            const bStreak: number = b.coinflipBestStreak;
            return (aStreak > bStreak) ? 1 : ((bStreak > aStreak) ? -1 : 0);
        });
    }

    return users.sort((a, b) => {
        return (a[sortType] > b[sortType]) ? 1 : (
            (b[sortType] > a[sortType]) ? -1 : 0
        );
    });
};

export { functions };

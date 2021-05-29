import { User } from '../../models/user.model';
import { Leaderboard } from '../../models/leaderboard.model';

export default async (client) => {
    client.logger.log(`Updating leaderboards...`);

    const users = await User.find({ banned: false });
    const lbTypes = [`streak`, `balance`, `coinflip`, `bet`];
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
};

const getTopTen = arr => arr.slice(-10).reverse();

const createLeaderboard = async client => {
    const leaderboard = new Leaderboard({ version: 1 });
    client.logger.ready(`Created leaderboard.`);

    return await leaderboard.save();
};

const sortLeaderboard = (users, type) => {
    const sortedUsers = sortUsers(users, type);
    const topTen = getTopTen(sortedUsers);

    return topTen;
};

// The sort type is the property of users that the function sorts by
const sortUsers = (users, sortType) => {
    if (sortType === `streak`) sortType = `dailyStreak`;

    if (sortType === `bet`) {
        return users.sort((a, b) => {
            const aBet = a.highestBet.amount;
            const bBet = b.highestBet.amount;
            return (aBet > bBet) ? 1 : ((bBet > aBet) ? -1 : 0);
        });
    }

    if (sortType === `coinflip`) {
        return users.sort((a, b) => {
            const aStreak = a.coinflipBestStreak;
            const bStreak = b.coinflipBestStreak;
            return (aStreak > bStreak) ? 1 : ((bStreak > aStreak) ? -1 : 0);
        });
    }

    return users.sort((a, b) => (a[sortType] > b[sortType])
        ? 1
        : (
            (b[sortType] > a[sortType]) ? -1 : 0
        ));
};

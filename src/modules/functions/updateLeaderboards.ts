import { User } from "../../models/user.model";
import { Leaderboard } from "../../models/leaderboard.model";

export default async (client) => {
    client.logger.log("Updating leaderboards...");

    const users: any = await User.find({ banned: false });
    const lbTypes = ["streak", "balance", "coinflip", "bet"];
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

const getTopTen = (arr: any[]) => arr.slice(-10).reverse();

const createLeaderboard = async client => {
    const leaderboard = new Leaderboard({ version: 1 });
    client.logger.ready("Created leaderboard.");

    return await leaderboard.save();
};

const sortLeaderboard = (users, type) => {
    const sortedUsers: any = sortUsers(users, type);
    const topTen: any = getTopTen(sortedUsers);

    return topTen;
};

// The sort type is the property of users that the function sorts by
const sortUsers = (users: any[], sortType: string) => {
    if (sortType === "streak") sortType = "dailyStreak";

    if (sortType === "bet") {
        return users.sort((a, b) => {
            const aBet: number = a.highestBet.amount;
            const bBet: number = b.highestBet.amount;
            return (aBet > bBet) ? 1 : ((bBet > aBet) ? -1 : 0);
        });
    }

    if (sortType === "coinflip") {
        return users.sort((a, b) => {
            const aStreak: number = a.coinflipBestStreak;
            const bStreak: number = b.coinflipBestStreak;
            return (aStreak > bStreak) ? 1 : ((bStreak > aStreak) ? -1 : 0);
        });
    }

    return users.sort((a, b) => (a[sortType] > b[sortType]) ? 1 : (
        (b[sortType] > a[sortType]) ? -1 : 0
    ));
};

import User from '../models/user.model';
import Leaderboard from '../models/leaderboard.model';

import { Client } from '../types/discord';
import * as Discord from 'discord.js';

import log from './log';

interface LeaderboardUser {
    username: string;
    discordTag: string;

    balance: number;
    highestBet: number;

    dailyStreak: number;
    coinflipStreak: number;
}

const createLeaderboard = async (client: Client) => {
    const lb: LeaderboardUser[] = [];

    // Grab all existing users.
    const users = await User.find({ banned: false });
    if (!users) return lb;

    // Delete all existing leaderboards.
    Leaderboard.deleteMany({});

    for (const user of users) {
        const discordUser: Discord.User = await client.users.fetch(user.discordID);

        lb.push({
            username: user.username,
            discordTag: discordUser.tag,

            balance: user.balance,

            highestBet: user.highscores.bet,

            dailyStreak: user.streaks.daily,
            coinflipStreak: user.streaks.coinflip
        });
    }
};

const sortLeaderboard = async (type: string, lb: LeaderboardUser[]) => {
    switch (type) {
        case `bet`:
            break;
        case `coinflip`:
            lb.sort((a, b) => (a.coinflipStreak > b.coinflipStreak) ? 1 : (b.coinflipStreak > a.coinflipStreak) ? -1 : 0);
            break;
        case `daily`:
            lb.sort((a, b) => (a.dailyStreak > b.dailyStreak) ? 1 : (b.dailyStreak > a.dailyStreak) ? -1 : 0);
            break;
        default:
            lb.sort((a, b) => (a.balance > b.balance) ? 1 : (b.balance > a.balance) ? -1 : 0);
            break;
    }
};

const updateLeaderboards = async (client: Client) => {
    log(`cyan`, `Updating leaderboards...`);

    const leaderboard = await createLeaderboard(client);
    if (leaderboard.length === 0) return log(`yellow`, `No active users found. Skipping...`);

    const lb = new Leaderboard({
        balance: await sortLeaderboard(`balance`, leaderboard)
    });

    return await lb.save();
};

export default updateLeaderboards;

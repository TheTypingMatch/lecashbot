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

    for (const user of users) {
        const discordUser: Discord.User = await client.users.fetch(user.discordID);

        // Add users to the generic leaderboard.
        lb.push({
            username: user.username,
            discordTag: discordUser?.tag || `Deleted User#0000`,

            balance: user.balance,

            highestBet: user.highscores.bet,

            dailyStreak: user.streaks.daily,
            coinflipStreak: user.streaks.coinflip
        });
    }

    // Return the completed leaderboard.
    return lb;
};

const sortLeaderboard = async (type: string, lb: LeaderboardUser[]) => {
    switch (type) {
        case `bet`:
            break;
        case `coinflip`:
            lb.sort((a, b) => (a.coinflipStreak <= b.coinflipStreak) ? 1 : -1);
            break;
        case `daily`:
            lb.sort((a, b) => (a.dailyStreak <= b.dailyStreak) ? 1 : -1);
            break;
        default:
            lb.sort((a, b) => (a.balance <= b.balance) ? 1 : -1);
            break;
    }

    return lb;
};

const updateLeaderboards = async (client: Client, callback?: any) => {
    log(`cyan`, `Updating leaderboards...`);

    // Delete all existing leaderboards.
    const leaderboards = await Leaderboard.find({});
    for (const leaderboard of leaderboards) leaderboard.delete();

    const leaderboard = await createLeaderboard(client);
    if (!leaderboard || leaderboard.length === 0) {
        log(`yellow`, `No active users found. Skipping...`);

        if (callback !== undefined) callback();
        return;
    }

    const users = await User.find({ banned: false });

    let totalBalance = 0;
    for (const user of users) totalBalance += user.balance;

    const lb = new Leaderboard({
        balance: await sortLeaderboard(`balance`, leaderboard),
        bet: await sortLeaderboard(`bet`, leaderboard),
        coinflip: await sortLeaderboard(`coinflip`, leaderboard),
        daily: await sortLeaderboard(`daily`, leaderboard),

        totalBalance
    });

    await lb.save();
    log(`green`, `Leaderboards updated.`);

    if (callback !== undefined) return callback();
};

export default updateLeaderboards;

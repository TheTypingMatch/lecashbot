interface Leaderboard {
    username: string;
    discordID: string;
}

interface Balance extends Leaderboard {
    balance: number;
}

interface Bet extends Leaderboard {
    bet: number;
}

interface Coinflip extends Leaderboard {
    coinflip: number;
}

interface Daily extends Leaderboard {
    streak: number;
}

interface LeaderboardUser {
    username: string;
    discordTag: string;

    balance: number;
    highestBet: number;

    dailyStreak: number;
    coinflipStreak: number;
}

export {
    Balance,
    Bet,
    Coinflip,
    Daily,

    LeaderboardUser
};

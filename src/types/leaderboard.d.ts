interface Leaderboard {
    username: string;
    discordID: string;
}

interface Bet extends Leaderboard {
    bet: number;
}

interface Cash extends Leaderboard {
    cash: number;
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
    Bet,
    Cash,
    Coinflip,
    Daily,

    LeaderboardUser
};

import * as Mongoose from 'mongoose';

import * as Leaderboard from './leaderboard';

interface UserDoc extends Mongoose.Document {
    username: string;
    discordID: string;

    balance?: number;
    donated?: number;

    creationDate: string;
    banned?: boolean;

    badges?: {
        owner: boolean;
        dev: boolean;
        admin: boolean;
        donor: boolean;
        tester: boolean;

        logoCreator?: boolean;
    }

    cooldowns?: {
        bet: string;
        coinflip: string;
        daily: string;
        delete: string;
        give: string;
        rename: string;
        report: string;
        suggest: string;
        withdraw: string;
    }

    streaks?: {
        daily: number;
        coinflip: number;
    }

    highscores?: {
        bet: number;
        coinflip: number;
        daily: number;
    }
}

interface LotteryDoc extends Mongoose.Document {
    name: string;

    creationDate: string;
    endDate: string;

    entryFee: number;
    entries: string[];

    previousWinner?: string;
}

interface LeaderboardDoc extends Mongoose.Document {
    creationDate: string;

    balance: Leaderboard.Balance[];
    bet: Leaderboard.Bet[];
    coinflip: Leaderboard.Coinflip[];
    daily: Leaderboard.Daily[];

    totalBalance: number;
}

export {
    UserDoc,
    LotteryDoc,
    LeaderboardDoc
};

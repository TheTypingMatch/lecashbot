import * as Mongoose from 'mongoose';

import * as Leaderboard from './leaderboard';

interface UserDoc extends Mongoose.Document {
    username: string;
    discordID: string;

    balance?: number;

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
        daily: string;
        delete: string;
        coinflip: string;
        give: string;
        report: string;
        suggest: string;
        withdraw: string;
        rename: string;
    }

    donations?: number;

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

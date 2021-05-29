import * as Mongoose from 'mongoose';

import * as Leaderboard from './leaderboard';

interface UserDoc extends Mongoose.Document {
    username: string;
    discordID: string;

    nitrotypeLink: string;
    balance?: number;

    creationDate: any;
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
        bet: any;
        daily: any;
        delete: any;
        coinflip: any;
        give: any;
        report: any;
        suggest: any;
        withdraw: any;

        command: any;
    }

    donations?: number;

    streaks?: {
        daily: number;
        coinflip: number;
    }

    bestStreak?: {
        daily: number;
        coinflip: number;
    }
}

interface LotteryDoc extends Mongoose.Document {
    name: string;

    creationDate: any;
    endDate: any;

    entryFee: number;
    entries: string[];

    previousWinner?: string;
}

interface LeaderboardDoc extends Mongoose.Document {
    creationDate?: any;

    balance: Leaderboard.Balance[];
    bet: Leaderboard.Bet[];
    coinflip: Leaderboard.Coinflip[];
    streak: Leaderboard.Streak[];

    totalBalance: number;
}

export {
    UserDoc,
    LotteryDoc,
    LeaderboardDoc
};

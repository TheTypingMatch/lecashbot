import * as Mongoose from 'mongoose';

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

    streak?: {
        daily: number;
        coinflip: number;
    }

    bestStreak?: {
        daily: number;
        coinflip: number;
    }
}

interface LotteryDoc extends Mongoose.Document {}

interface LeaderboardDoc extends Mongoose.Document {}

export {
    UserDoc,
    LotteryDoc,
    LeaderboardDoc
};

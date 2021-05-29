import * as Mongoose from 'mongoose';

interface User extends Mongoose.Document {
    username: string;
    discordID: string;

    nitroTypeLink: string;
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
interface Lottery extends Mongoose.Document {}
interface Leaderboard extends Mongoose.Document {}

export {
    User,
    Lottery,
    Leaderboard
};

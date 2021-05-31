import * as Mongoose from 'mongoose';

import { UserDoc } from '../types/models';

const userSchema = new Mongoose.Schema({
    username: { type: String, required: true },
    discordID: { type: String, required: true },

    balance: { type: Number, required: false, default: 1000 },
    donated: { type: Number, required: false, default: 0 },

    creationDate: { type: Date, required: false, default: new Date() },
    banned: { type: Boolean, required: false, default: false },

    badges: {
        owner: { type: Boolean, required: false, default: false },
        dev: { type: Boolean, required: false, default: false },
        admin: { type: Boolean, required: false, default: false },
        donor: { type: Boolean, required: false, default: false },
        tester: { type: Boolean, required: false, default: false },

        logoCreator: { type: Boolean, required: false }
    },

    cooldowns: {
        bet: { type: String, required: false, default: new Date(1970, 0, 1).toString() },
        coinflip: { type: String, required: false, default: new Date(1970, 0, 1).toString() },
        daily: { type: String, required: false, default: new Date(1970, 0, 1).toString() },
        delete: { type: String, required: false, default: new Date().toString() },
        give: { type: String, required: false, default: new Date(1970, 0, 1).toString() },
        rename: { type: String, required: false, default: new Date().toString() },
        report: { type: String, required: false, default: new Date(1970, 0, 1).toString() },
        suggest: { type: String, required: false, default: new Date(1970, 0, 1).toString() },
        withdraw: { type: String, required: false, default: new Date(1970, 0, 1).toString() }
    },

    streaks: {
        daily: { type: Number, required: false, default: 0 },
        coinflip: { type: Number, required: false, default: 0 }
    },

    highscores: {
        bet: { type: Number, required: false, default: 0 },
        coinflip: { type: Number, required: false, default: 0 },
        daily: { type: Number, required: false, default: 0 }
    }
});

const User = Mongoose.model<UserDoc>(`User`, userSchema);

export default User;

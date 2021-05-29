import * as Mongoose from 'mongoose';

import { UserDoc } from '../types/models';

const userSchema = new Mongoose.Schema({
    username: { type: String, required: true },
    discordID: { type: String, required: true },

    nitrotypeLink: { type: String, required: true },
    balance: { type: Number, required: false, default: 0 },

    creationDate: { type: Date, required: false, default: new Date() },
    banned: { type: Boolean, required: false, default: false },

    badges: {
        owner: { type: Boolean, required: false, default: false },
        dev: { type: Boolean, required: false, default: false },
        admin: { type: Boolean, required: false, default: false },
        donor: { type: Boolean, required: false, default: false },
        tester: { type: Boolean, required: false, default: false },

        logoCreator: { type: Boolean, required: false, default: false }
    },

    cooldowns: {
        bet: { type: Date, required: false, default: new Date(2000, 0, 1) },
        daily: { type: Date, required: false, default: new Date(2000, 0, 1) },
        delete: { type: Date, required: false, default: new Date() },
        coinflip: { type: Date, required: false, default: new Date(2000, 0, 1) },
        give: { type: Date, required: false, default: new Date(2000, 0, 1) },
        report: { type: Date, required: false, default: new Date(2000, 0, 1) },
        suggest: { type: Date, required: false, default: new Date(2000, 0, 1) },
        withdraw: { type: Date, required: false, default: new Date(2000, 0, 1) },

        command: { type: Date, required: false, default: new Date(2000, 0, 1) }
    },

    streaks: {
        daily: { type: Number, required: false, default: 0 },
        coinflip: { type: Number, required: false, default: 0 }
    }
});

const User = Mongoose.model<UserDoc>(`User`, userSchema);

export default User;

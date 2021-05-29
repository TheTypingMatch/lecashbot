import * as Mongoose from 'mongoose';

import { LeaderboardDoc } from '../types/models';

const leaderboardSchema = new Mongoose.Schema({
    creationDate: { type: Date, required: false, default: new Date() },

    balance: { type: Array, required: true },
    bet: { type: Array, required: true },
    coinflip: { type: Array, required: true },
    streak: { type: Array, required: true }
});

const Leaderboard = Mongoose.model<LeaderboardDoc>(`Leaderboard`, leaderboardSchema);

export default Leaderboard;

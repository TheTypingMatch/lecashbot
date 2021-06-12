import * as Mongoose from 'mongoose';

import { LeaderboardDoc } from '../types/models';

const leaderboardSchema = new Mongoose.Schema({
    creationDate: { type: String, required: false, default: new Date().toString() },

    bet: { type: Array, required: true },
    cash: { type: Array, required: true },
    coinflip: { type: Array, required: true },
    daily: { type: Array, required: true },

    totalBalance: { type: Number, required: true }
});

const Leaderboard = Mongoose.model<LeaderboardDoc>(`Leaderboard`, leaderboardSchema);

export default Leaderboard;

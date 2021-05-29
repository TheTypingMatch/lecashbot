import * as Mongoose from 'mongoose';

import { LotteryDoc } from '../types/models';

const lotterySchema = new Mongoose.Schema({
    // The type of lottery (daily, weekly, monthly).
    name: { type: String, required: true },

    creationDate: { type: String, required: false, default: new Date().toString() },
    endDate: { type: String, required: true },

    entryFee: { type: Number, required: true },
    entries: { type: Array, required: false, default: [] },

    previousWinner: { type: String, required: false }
});

const Lottery = Mongoose.model<LotteryDoc>(`Lottery`, lotterySchema);

export default Lottery;

import * as mongoose from 'mongoose';

const lotterySchema = new mongoose.Schema({
    // daily, weekly, monthly
    type: {
        type: String,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    // daily: $1,000, weekly: $5,000, monthly, $25,000
    entryFee: {
        type: Number,
        required: true,
        default: 1000
    },
    // An array of id's of people who entered
    entries: {
        type: Array,
        required: false,
        default: []
    },
    // A string that is updated to contain the last winner of the lottery
    previousWinner: {
      type: String,
      required: false
    }
});

const Lottery = mongoose.model('Lottery', lotterySchema);

export { Lottery };

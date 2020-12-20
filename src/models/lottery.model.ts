import * as mongoose from 'mongoose';

const lotterySchema = new mongoose.Schema({
    // daily, weekly, monthly
    name: {
        type: Number,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    // daily: $100, weekly: $1,000, monthly, $10,000
    entryFee: {
        type: Number,
        required: true,
        default: 100
    },
    // An array of id's of people who entered
    entries: {
        type: Array,
        required: false,
        default: []
    }
});
    
const Lottery = mongoose.model('Lottery', lotterySchema);

export { Lottery };

import * as mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
    version: {
        type: Number,
        required: true,
        default: 1
    },
    streak: {
        type: Array,
        required: false,
        default: []
    },
    balance: {
        type: Array,
        required: false,
        default: []
    },
    coinflip: {
        type: Array,
        required: false,
        default: []
    },
    bet: {
        type: Array,
        required: false,
        default: []
    }
});

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);

export { Leaderboard };

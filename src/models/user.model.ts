import * as mongoose from 'mongoose'

const articleSchema = new mongoose.Schema({
    date: {
        type: Object,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    nitroTypeLink: {
        type: String,
        required: true
    },
    discordId: {
        type: String,
        required: true
    },
    discordTag: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: false,
        default: 0
    },
    dailyStreak: {
        type: Number,
        required: false,
        default: 0
    },
    donated: {
        type: Boolean,
        required: false,
        default: false
    },
    banned: {
        type: Boolean,
        required: false,
        default: false
    },
    highestBet: {
        type: Object,
        required: false,
        default: {
            chance: 0,
            amount: 0
        }
    },
    cooldowns: {
        type: Object,
        required: false,
        default: {
            bet: 0,
            daily: 0,
            delete: new Date(),
            coinflip: 0,
            give: 0,
            report: 0,
            suggest: 0,
            withdraw: 0
        }
    },
    donations: {
        type: Number,
        required: false,
        default: 0
    },
    dev: {
        type: Boolean,
        required: false,
        default: false
    },
    admin: {
        type: Boolean,
        required: false,
        default: false
    },
    donor: {
        type: Boolean,
        required: false,
        default: false
    },
    tester: {
        type: Boolean,
        required: false,
        default: false
    },
    logoCreator: {
        type: Boolean, 
        required: false,
        default: false
    },
    owner: {
        type: Boolean,
        required: false,
        default: false
    },
    coinflipStreak: {
        type: Number,
        required: false,
        default: 0
    },
    coinflipBestStreak: {
        type: Number, 
        required: false, 
        default: 0
    },
    cmdCooldown: {
        type: Date,
        required: false,
        default: 0
    }
})

const User = mongoose.model('Article', articleSchema)

export { User }

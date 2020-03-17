const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
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
    coolDowns: {
        type: Object, 
        required: false, 
        default: {
            commands: {
                bet: 0, 
                daily: 0, 
                delete: new Date(), 
                coinflip: 0, 
                give: 0, 
                report: 0, 
                suggest: 0, 
                withdraw: 0
            },
            getCash: 0
        }
    }
})

module.exports = mongoose.model('Article', articleSchema)

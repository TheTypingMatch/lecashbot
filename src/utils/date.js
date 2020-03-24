module.exports = {
    toSeconds: date => {
        return date / 1000
    },
    toMinutes: date => {
        return (date / 1000) / 60
    }, 
    toHours: date => {
        return (date / 1000) / 3600
    },
    toDays: date => {
        return ((date / 1000) / 3600) / 24
    }
}

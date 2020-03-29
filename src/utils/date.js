module.exports = {
    toMinutes: date => (date / 1000) / 60, 
    toHours: date => (date / 1000) / 3600,
    toDays: date => ((date / 1000) / 3600) / 24
}

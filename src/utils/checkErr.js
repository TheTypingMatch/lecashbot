const log = require('./log')

module.exports = (err, client, success) => {
    if (err) log('error', err, client)
    else if (success) success()
}

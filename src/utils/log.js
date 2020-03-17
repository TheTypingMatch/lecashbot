const fs = require('fs')
const config = require('../../config/config')

module.exports = (type, msg) => {
    if (config.logEnabled)
        fs.appendFile(`./logs/${type}.log`, `${msg}\n`, err => console.log((err) ? err : msg))
}

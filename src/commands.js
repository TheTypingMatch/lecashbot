const fs = require('fs')
const path = require('path')

module.exports = {
    run: (cmd, msg, client, args) => {
        const cmdPath = path.join(__dirname, `./commands/${cmd}.js`)
        if (fs.existsSync(cmdPath))
            require(`./commands/${cmd}`)(msg, client, args)
    }
}

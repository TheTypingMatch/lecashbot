const checkErr = require('../utils/checkErr')

module.exports = async (client, err) => {
    checkErr(err, client)
}

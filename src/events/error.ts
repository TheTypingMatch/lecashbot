const error = async (client, err) => require('../utils/checkErr')(err, client)

export { error }

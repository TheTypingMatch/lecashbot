module.exports = {
    db: {
        uri: process.env.URI, 
        uriParams: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } 
    },
    version: '0.0.0',
    token: process.env.TOKEN,
    prefix: '$',
    devMode: false, 
    logEnabled: true
}

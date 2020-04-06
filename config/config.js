module.exports = {
    db: {
        uri: process.env.URI, 
        uriParams: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } 
    },
    logs: {
        error: '692123000602099712',
        cash: '691405983636783194'
    },
    colors: {
        red: 0xE84444, 
        yellow: 0xF09F19, 
        green: 0x40AC7B
    },
    channels: {
        log: [
            '691405983636783194', 
            '587716900721786880'
        ],
        error: ['692123000602099712']
    },
    version: '1.0.1',
    token: process.env.TOKEN,
    prefix: '$',
    devMode: false, 
    logEnabled: true
}

import * as dotenv from 'dotenv';
import { log } from './utils/log';
import { functions } from './modules/functions';
const Discord = require('discord.js');
const mongoDB = require('mongodb');
const mongoose = require('mongoose');

const client: any = new Discord.Client({
    disableEveryone: true,
    ws: {
        intents: ['GUILDS', 'GUILD_MESSAGES']
    },
    partials: ['MESSAGE', 'REACTION']
});

dotenv.config();
functions(client);

client.config = require('./config/config.js');
client.loader = require('./modules/Loader');
client.msgCooldowns = [];

const URI: string = process.env.URI;
const URIParams: {} = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const initDatabase = () => {
    mongoDB.connect(URI, URIParams, (err: any) => {
        if (err) log('error', err, client);
        else client.logger.log('Successfully connected to database.', 'ready');
    });

    mongoose.connect(URI, URIParams, err => {
        if (err) log('error', err, client);
    });
};

const init = async () => {
    const {
        registerModules,
        registerEvents,
        checkDiscordStatus
    } = client.loader;

    console.clear();
    await registerModules(client);
    await registerEvents(client);
    await checkDiscordStatus(client);
    await client.login(process.env.TOKEN);

    return initDatabase();
};

init();

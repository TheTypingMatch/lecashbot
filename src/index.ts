import * as Discord from 'discord.js';
import { Client } from './types/discord';

import * as mongoose from 'mongoose';

import config from '../config/config';

import log from './utils/log';
import * as loader from './utils/loader';

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const client: Client = new Discord.Client({
    disableMentions: `everyone`,
    fetchAllMembers: true
});

// Uncaught exception handler.
process.on(`uncaughtException`, e => log(`red`, e.stack));

const startBot = async () => {
    await loader.loadCommands(client);
    await loader.loadEvents(client);

    await client.login(process.env.DISCORD_TOKEN).catch(() => log(`red`, `Failed to authenticate client with application.`));
};

startBot();

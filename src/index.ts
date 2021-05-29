import * as Discord from 'discord.js';
import { Client } from './types/discord';

import * as mongoose from 'mongoose';

import * as loader from './utils/loader';
import log from './utils/log';

const client: Client = new Discord.Client({
    disableMentions: `everyone`,
    fetchAllMembers: true
});

// Uncaught exception handler.
process.on(`uncaughtException`, e => log(`red`, e.stack));

// Bot startup.
const startBot = async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    log(`green`, `Connected to database.`);
    
    await loader.loadCommands(client);
    log(`green`, `All commands loaded!`);

    await loader.loadEvents(client);
    log(`green`, `All events loaded!`);

    await client.login(process.env.DISCORD_TOKEN).catch(() => log(`red`, `Failed to authenticate client with application.`));
};

// Actually start the bot.
startBot();

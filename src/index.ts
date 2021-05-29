import * as Discord from 'discord.js';
import mongoose from 'mongoose';

import { Client } from './types/discord';
import log from './utils/log';

import { logSplash } from './utils/logExtra';
import * as loader from './utils/loader';

const client: Client = new Discord.Client({
    disableMentions: `everyone`,
    fetchAllMembers: true
});

// Uncaught exception handler.
process.on(`uncaughtException`, e => log(`red`, e.stack));

// Bot startup.
const startBot = async () => {
    // Splash menu.
    await logSplash();

    log(`green`, `Connected to database.`);

    await loader.loadCommands(client);
    log(`green`, `All commands loaded!`);

    await loader.loadEvents(client);
    log(`green`, `All events loaded!`);

    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    await client.login(process.env.DISCORD_TOKEN).catch(() => log(`red`, `Failed to authenticate client with application.`));
};

// Actually start the bot.
startBot();

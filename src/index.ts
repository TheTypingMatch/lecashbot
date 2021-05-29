import * as Discord from 'discord.js';
import { Client } from './types/discord';

import * as fs from 'fs';
import * as path from 'path';

import * as mongoose from 'mongoose';

import config from '../config/config';
import log from './utils/log';

import * as dotenv from 'dotenv';
dotenv.config();

mongoose.connect(config.db.uri, config.db.uriParams);

const client: Client = new Discord.Client({
    disableMentions: `everyone`,
    fetchAllMembers: true
});

// Uncaught exception handler.
process.on(`uncaughtException`, e => log(`red`, e.stack));

// Load events.
fs.readdir(path.resolve(__dirname, `events`), async (err, files) => {
    for (const file of files) {
        if (err) log(`red`, err);
        log(`yellow`, `Loaded event ${file}.`);

        const event = await import(`./events/${file}`);
        client.on(file.split(`.`)[0], event.callback.bind(null, client));
    }
});

// Load commands.
fs.readdir(path.resolve(__dirname, `events`), async (err, files) => {
    for (const file of files) {
        if (err) log(`red`, err);
        log(`yellow`, `Loaded command ${file}.`);

        const command = await import(`./commands/${file}`);
        client.commands.push({
            name: file.split(`.`)[0],
            desc: command.desc,
            usage: command.usage,
            aliases: command.aliases,
            run: command.run
        });
    }
});

client.login(process.env.DISCORD_TOKEN).catch(() => log(`red`, `Failed to authenticate client with application.`));

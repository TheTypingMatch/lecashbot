import * as Discord from 'discord.js';
import { Client, Command, Event } from './types/discord';

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
const events = fs.readdirSync(path.resolve(__dirname, `events`));
for (const file of events) {
    const event = import(`./events/${file}`);

    log(`yellow`, `Loaded event ${file}.`);
    client.on(file.split(`.`)[0], event.bind(null, client));
}

// Load commands.
const commandFiles = fs.readdirSync(path.resolve(__dirname, `commands`));
for (const file of commandFiles) {
    const command = import(`./commands/${file}`);

    log(`yellow`, `Loaded command ${file}.`);
    client.commands.push({
        name: file.split(`.`)[0],
        desc: command.desc,
        usage: command.usage,
        aliases: command.aliases,
        run: command.run
    });
}

client.login(process.env.DISCORD_TOKEN).catch(() => log(`red`, `Failed to authenticate client with application.`));

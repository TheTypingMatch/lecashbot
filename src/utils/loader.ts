import * as fs from 'fs';
import * as path from 'path';

import { Client } from '../types/discord';

import log from './log';
import { logHeader } from './logExtra';

const loadCommands = (client: Client, callback?: any) => {
    logHeader();

    // Initialize the commands array.
    client.commands = [];

    fs.readdir(path.resolve(__dirname, `../commands`), async (err, files) => {
        for (const file of files) {
            if (err) log(`red`, err);
            log(`yellow`, `Loaded command ${file}.`);

            const command = await import(`../commands/${file}`);
            client.commands.push({
                name: file.split(`.`)[0],
                config: {
                    desc: command.cmd.desc,
                    usage: command.cmd.usage || ``,
                    aliases: command.cmd.aliases || []
                },
                run: command.run
            });
        }

        return callback();
    });
};

const loadEvents = (client: Client, callback?: any) => {
    logHeader();

    // Initialize client events.
    client.events = [];

    fs.readdir(path.resolve(__dirname, `../events`), async (err, files) => {
        for (const file of files) {
            if (err) log(`red`, err);
            log(`yellow`, `Loaded event ${file}.`);

            const event = await import(`../events/${file}`);
            client.on(file.split(`.`)[0], event.default.bind(null, client));

            client.events.push({
                name: file.split(`.`)[0],
                callback: event
            });
        }

        return callback();
    });
};

export {
    loadCommands,
    loadEvents
};

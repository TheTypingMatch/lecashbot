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

            const fileName = file.split(`.`)[0];
            log(`yellow`, `Loaded command ${fileName}.`);

            const command = await import(`../commands/${file}`);
            client.commands.push({
                name: fileName,
                config: {
                    desc: command.cmd.desc,
                    category: command.cmd.category,
                    usage: command.cmd.usage || ``,
                    aliases: command.cmd.aliases || []
                },
                run: command.run
            });
        }

        if (callback !== undefined) return callback();
    });
};

const loadEvents = (client: Client, callback?: any) => {
    logHeader();

    // Initialize client events.
    client.events = [];

    fs.readdir(path.resolve(__dirname, `../events`), async (err, files) => {
        for (const file of files) {
            if (err) log(`red`, err);

            const fileName = file.split(`.`)[0];
            log(`yellow`, `Loaded event ${fileName}.`);

            const event = await import(`../events/${file}`);
            client.on(fileName, event.default.bind(null, client));

            client.events.push({
                name: fileName,
                callback: event
            });
        }

        if (callback !== undefined) return callback();
    });
};

export {
    loadCommands,
    loadEvents
};

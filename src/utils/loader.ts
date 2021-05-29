import * as fs from 'fs';
import * as path from 'path';

import { Client, Command, Event } from '../types/discord';
import log from './log';

const loadCommands = (client: Client, callback?: any) => {
    // Initialize the commands array.
    client.commands = [];

    fs.readdir(path.resolve(__dirname, `../commands`), async (err, files) => {
        for (const file of files) {
            if (err) log(`red`, err);
            log(`yellow`, `Loaded command ${file}.`);

            const command: Command = await import(`../commands/${file}`);
            client.commands.push({
                name: file.split(`.`)[0],
                config: {
                    desc: command.config.desc,
                    usage: command.config.usage || ``,
                    aliases: command.config.aliases || []
                },
                run: command.run
            });
        }
    });

    return callback();
};

const loadEvents = (client: Client, callback?: any) => {
    fs.readdir(path.resolve(__dirname, `../events`), async (err, files) => {
        for (const file of files) {
            if (err) log(`red`, err);
            log(`yellow`, `Loaded event ${file}.`);

            const event: Event = await import(`../events/${file}`);
            client.on(file.split(`.`)[0], event.callback.bind(null, client));
        }
    });

    return callback();
};

export {
    loadCommands,
    loadEvents
};

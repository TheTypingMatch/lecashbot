import * as path from 'path';

import { Client } from '../types/discord';

import log from '../utils/log';
import { logHeader } from '../utils/logExtra';

import readDirectory from '../utils/readDirectory';

const loadCommands = async (client: Client) => {
    logHeader();

    // Initialize the commands array.
    client.commands = [];

    const files = readDirectory(path.resolve(__dirname, `../commands`));

    for (const file of files) {
        const fileName = file.split(`\\`).pop().split(`.`)[0];
        log(`yellow`, `Loaded command ${fileName}.`);

        const command = await import(file);
        client.commands.push({
            name: fileName,
            admin: file.split(`\\`).includes(`admin`),
            config: {
                desc: command.cmd.desc,
                category: command.cmd.category,
                usage: command.cmd.usage || ``,
                aliases: command.cmd.aliases || []
            },
            run: command.run
        });
    }
};

const loadEvents = async (client: Client) => {
    logHeader();

    // Initialize client events.
    client.events = [];

    const files = readDirectory(path.resolve(__dirname, `../events`));

    for (const file of files) {
        const fileName = file.split(`\\`).pop().split(`.`)[0];
        log(`yellow`, `Loaded event ${fileName}.`);

        const event = await import(file);
        client.on(fileName, event.default.bind(null, client));

        client.events.push({
            name: fileName,
            callback: event
        });
    }
};

export {
    loadCommands,
    loadEvents
};

import * as fs from 'fs';
import { colors, logEnabled, channels, version } from '../config/config';

const Discord = require('discord.js');

const log = (type: string, msg: string, client) => {
    if (logEnabled) {
        fs.appendFile(`./logs/${type}.log`, `${msg} - ${new Date()}\n`, err => {
            if (err) {
                console.log(err);
            }
        });

        if (type === 'cash') {
            client.logger.log(msg.replace(/\*/g, ''));
        }
    }
};

export { log };

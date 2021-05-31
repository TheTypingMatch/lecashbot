import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

import config from '../../config/config';
import User from '../models/user.model';

const cmd: CommandConfig = {
    desc: `Gamble money.`,
    category: `economy`,
    usage: `<amount>`
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const m = `${message.author} »`;
};

export {
    cmd,
    run
};

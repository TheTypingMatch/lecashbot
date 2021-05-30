import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

const cmd: CommandConfig = {
    desc: `View all commands`
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    // const m = `${message.author} »`;
};

export {
    cmd,
    run
};

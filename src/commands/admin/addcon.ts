import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../../types/discord';

// import config from '../../../config/config';
// import log from '../../utils/log';

import User from '../../models/user.model';

import getQuery from '../../utils/getQuery';

const cmd: CommandConfig = {
    desc: `Add a contributor.`,
    category: `admin`,
    usage: `<user> <contribution> [amount]`
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const m = `${message.author} »`;
    const query = getQuery(message, args);

    const user = await User.findOne(query);
    if (!user) return message.channel.send(`${m} That user does not have an account!`);
};

export {
    cmd,
    run
};

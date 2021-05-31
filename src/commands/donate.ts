import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

import config from '../../config/config';
import User from '../models/user.model';

const cmd: CommandConfig = {
    desc: `Donate to the bot.`,
    category: `guides`,
    aliases: [`donors`]
};

const getDonors = async () => {
    const donors = await User.find({ banned: false, [`badges/donor`]: true });
    return donors.map((donor) => ({
        discordID: donor.discordID,
        amount: donor.donations
    }));
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {};

export {
    cmd,
    run
};

import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

import config from '../../config/config';
import User from '../models/user.model';

import { formatMoney } from '../utils/text';

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

const addField = async (userData: any[], client: Client) => {
    userData.sort((a, b) => (a.amount > b.amount ? 1 : (b.amount > a.amount) ? -1 : 0));

    let field = ``;
    for (const userID of userData) {
        const discUser = await client.users.fetch(userID);
        field += `${discUser?.username || ``} ${userData.length > 5 ? ` ` : `\n`}
        `;
    }

    return `${userData.map(user => `**${user.name}** - \`$${formatMoney(user.amount || 0)}\`\n`)}`.replace(/\n,/g, `\n`);
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {};

export {
    cmd,
    run
};

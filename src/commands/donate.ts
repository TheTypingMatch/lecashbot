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
    for (const user of userData) {
        const discUser = await client.users.fetch(user.id);
        field += `${discUser?.username || ``} ${formatMoney(user.amount)}\n`;
    }

    return field;
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const donors = await getDonors();

    const sEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.orange)
        .setAuthor(`Donate`, message.author.avatarURL())
        .setDescription(`Donate to LeCashBot **[here](https://donate.lecashbot.cf)**.`)
        .addField(`Donors`, await addField(donors, client))
        .setTimestamp(new Date())
        .setFooter(config.footer);

    message.channel.send(sEmbed);
};

export {
    cmd,
    run
};

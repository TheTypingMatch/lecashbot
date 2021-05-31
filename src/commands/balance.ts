import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

import config from '../../config/config';
import User from '../models/user.model';

import getQuery from '../utils/getQuery';
import { formatMoney } from '../utils/formatText';

const cmd: CommandConfig = {
    desc: `View yours or another user's balance.`,
    category: `economy`,
    usage: `[user]`,
    aliases: [`bal`, `worth`]
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const m = `${message.author} »`;

    const query = getQuery(message, args);

    const user = await User.findOne(query);
    if (!user) return message.channel.send(`${m} That user does not have an account!`);

    const discordUser = await client.users.cache.get(user.discordID);

    const sEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setAuthor(`Balance`, discordUser?.avatarURL() || client.user.avatarURL())
        .setDescription(`**${discordUser?.username || user.username}**'s balance is **$${formatMoney(user.balance)}**.`)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    message.channel.send(sEmbed);
};

export {
    cmd,
    run
};

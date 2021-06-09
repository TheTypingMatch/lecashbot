import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../../types/discord';

import config from '../../../config/config';
import User from '../../models/user.model';
import log from '../../utils/log';

import getQuery from '../../utils/getQuery';

const cmd: CommandConfig = {
    desc: `Ban a user.`,
    category: `admin`,
    usage: `<user>`
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const m = `${message.author} »`;

    const query = getQuery(message, args);

    const banUser = await User.findOne(query);
    if (!banUser) return message.channel.send(`${m} That user does not have an account!`);

    if (banUser.banned) return message.channel.send(`${m} That user is already banned!`);

    const discordUser = await client.users.fetch(banUser.discordID);

    const banEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.red)
        .setAuthor(`User Banned`, message.author.avatarURL())
        .setDescription(`You have banned **${discordUser?.tag || banUser.username}**.`)
        .setTimestamp(new Date())
        .setFooter(config.footer);

    banUser.banned = true;
    banUser.save();

    log(`yellow`, `${message.author.tag} banned ${discordUser?.tag || banUser.username}`);
    message.channel.send(banEmbed);
};

export {
    cmd,
    run
};

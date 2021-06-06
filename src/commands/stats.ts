import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

import config from '../../config/config';
import { formatMoney } from '../utils/text';

const cmd: CommandConfig = {
    desc: `View bot statistics.`,
    category: `guides`
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const stats = {
        servers: `Servers: **${formatMoney(client.guilds.cache.size)}**`,
        users: `Users: **${formatMoney(client.users.cache.size)}**`,
        latency: `Latency: **${Math.round(client.ws.ping)}** ms`
    };

    const statsEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setAuthor(`Stats`, message.author.avatarURL())
        .setDescription(Object.values(stats).map(value => `${value}`))
        .setTimestamp(new Date())
        .setFooter(config.footer);

    message.channel.send(statsEmbed);
};

export {
    cmd,
    run
};

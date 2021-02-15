import * as format from 'format-duration';
import { MessageEmbed } from 'discord.js';
import { colors, version } from '../config/config';
import { currency } from '../utils/format';

export default async (msg, client, args) => {
    const { guilds, users, ws } = client;
    const statsEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor('Stats', msg.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(`
            Servers - **${currency(guilds.cache.size)}**
            Users   - **${currency(users.cache.size)}**
            Latency - **${Math.round(ws.ping)}**ms
            Uptime - **${format(client.uptime)}**
        `);

    return msg.channel.send(statsEmbed);
};

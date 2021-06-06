import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

import config from '../../config/config';

const cmd: CommandConfig = {
    desc: `View client uptime.`,
    category: `guides`
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const uptimeFormat = {
        days: `${Math.floor(client.uptime / 864e5)}`,
        hours: `${Math.floor(client.uptime / 36e5)}`,
        minutes: `${Math.floor(client.uptime / 6e4)}`,
        seconds: `${Math.floor(client.uptime / 1e3)}`
    };

    const uptimeEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setAuthor(`Client Uptime`, message.author.avatarURL())
        .setDescription(`**${uptimeFormat.days}** Days\n**${uptimeFormat.hours}** Hours\n**${uptimeFormat.minutes}** Minutes\n**${uptimeFormat.seconds}** Seconds`)
        .setTimestamp(new Date())
        .setFooter(config.footer);

    message.channel.send(uptimeEmbed);
};

export {
    cmd,
    run
};

import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

import config from '../../config/config';

const cmd: CommandConfig = {
    desc: `View client uptime.`,
    category: `misc`
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const uptime = {
        days: `**${Math.floor(client.uptime / 864e5)}** Days`,
        hours: `**${Math.floor((client.uptime / 36e5) % 24)}** Hours`,
        minutes: `**${Math.floor((client.uptime / 1e3) % 60)}** Minutes`,
        seconds: `**${Math.floor(client.uptime % 1e3)}** Seconds`
    };

    const uptimeEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setAuthor(`Client Uptime`, message.author.avatarURL())
        .setDescription(Object.values(uptime).map(value => `${value}`))
        .setTimestamp(new Date())
        .setFooter(config.footer);

    message.channel.send(uptimeEmbed);
};

export {
    cmd,
    run
};

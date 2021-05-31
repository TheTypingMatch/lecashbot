import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

import config from '../../config/config';

const cmd: CommandConfig = {
    desc: `Show bot latency.`,
    category: `guides`
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const msg = await message.channel.send(`Pong?`);

    const sEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.orange)
        .setAuthor(`Ping`, message.author.avatarURL())
        .setDescription(`API: \`:${Math.abs(Math.round(client.ws.ping))}ms\`\nGateway: \`${Math.abs(Math.round(new Date().valueOf() - msg.createdTimestamp.valueOf()))}ms\``)
        .setTimestamp(new Date())
        .setFooter(config.footer);

    msg.edit(sEmbed);
};

export {
    cmd,
    run
};

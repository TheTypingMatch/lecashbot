import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

import config from '../../config/config';

const cmd: CommandConfig = {
    desc: `Invite the bot to your server.`,
    category: `guides`
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const sEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setAuthor(`Invite`, message.author.avatarURL())
        .setDescription(`Invite LeCashBot [**here**](https://invite.lecashbot.cf/).`)
        .setTimestamp(new Date())
        .setFooter(config.footer);

    message.channel.send(sEmbed);
};

export {
    cmd,
    run
};

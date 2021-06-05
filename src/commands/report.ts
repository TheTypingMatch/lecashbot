import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

import config from '../../config/config';

const cmd: CommandConfig = {
    desc: `Get a link for bug reports.`,
    category: `misc`
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const suggestEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setAuthor(`Report`, message.author.avatarURL())
        .setDescription(`Report a bug [here](https://github.com/TheTypingMatch/le-cash-bot/issues).`)
        .setTimestamp(new Date())
        .setFooter(config.footer);

    message.channel.send(suggestEmbed);
};

export {
    cmd,
    run
};

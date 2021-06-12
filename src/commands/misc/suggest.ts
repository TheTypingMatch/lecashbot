import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../../types/discord';

import config from '../../../config/config';

const cmd: CommandConfig = {
    desc: `Get a link for feature suggestions.`,
    category: `misc`
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const suggestEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setAuthor(`Suggest`, message.author.avatarURL())
        .setDescription(`Make a suggestion [here](https://github.com/TheTypingMatch/lecashbot/issues).`)
        .setTimestamp(new Date())
        .setFooter(config.footer);

    message.channel.send(suggestEmbed);
};

export {
    cmd,
    run
};

import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

import config from '../../config/config';
import { faqInfo } from '../../config/embeds';

const cmd: CommandConfig = {
    desc: `View frequently asked questions!`,
    category: `guides`
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const faqEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setAuthor(`FAQ`, message.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(config.footer);

    for (const question of faqInfo) faqEmbed.addField(question.q, question.a);
    message.channel.send(faqEmbed);
};

export {
    cmd,
    run
};

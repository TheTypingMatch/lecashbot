import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

import config from '../../config/config';
import { addDescriptionField } from '../utils/formatField';

const cmd: CommandConfig = {
    desc: `View info about the bot.`
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const { general, contribute, invite } = config.embeds.info;

    const sEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setAuthor(`Info`, message.author.avatarURL())
        .addField(`General`, addDescriptionField(general))
        .addField(`Contribute`, addDescriptionField(contribute))
        .addField(`Invite`, addDescriptionField(invite))
        .setTimestamp(new Date())
        .setFooter(config.footer);

    message.channel.send(sEmbed);
};

export {
    cmd,
    run
};

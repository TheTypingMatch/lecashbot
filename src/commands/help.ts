import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

import config from '../../config/config';
import { addCommandField } from '../utils/formatField';
import { capitalize } from '../utils/formatText';

const cmd: CommandConfig = {
    desc: `View all commands.`,
    category: `guides`,
    usage: `[category]`,
    aliases: [`?`]
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const helpSplash: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.yellow)
        .setAuthor(`Help Menu`, message.author.avatarURL(), `https://docs.lecashbot.cf/`)
        .setDescription(`**Categories**\n\`$help Register\`\n\`$help Guides\`\n\`$help Economy\`\n\`$help Games\`\n\`$help Misc\``)
        .setTimestamp(new Date())
        .setFooter(config.footer);

    if (!args[0]) return message.channel.send(helpSplash);

    const category = args.shift().toLowerCase();
    const commands = client.commands.filter(command => command.config.category === category);

    if (!commands || commands.length === 0) return message.channel.send(helpSplash);

    if (command.config.usage) data.push(`**Usage:** \`${config.prefix}${command.name} ${command.config.usage}\``);
    if (command.config.aliases) data.push(`**Aliases:** ${command.config.aliases.join(`, `)}`);

    const sEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.yellow)
        .setAuthor(`Help Menu`, message.author.avatarURL(), `https://docs.lecashbot.cf/`)
        .setDescription(`${command.config.desc}\n\n${data.join(`\n`)}`)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    message.channel.send(sEmbed);
};

export {
    cmd,
    run
};

import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

import config from '../../config/config';
import { addCommandField } from '../utils/field';
import { capitalize } from '../utils/text';

const cmd: CommandConfig = {
    desc: `View all commands.`,
    category: `guides`,
    usage: `[category]`,
    aliases: [`?`]
};

const desc = `A Discord.js bot based on the NitroType currency.\nPlease consider supporting the bot by [**donating here**](https://patreon.lecashbot.cf)!\n\nClick [**here**](https://invite.lecashbot.cf/) to invite the bot.`;

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const helpSplash: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setAuthor(`Help Menu`, message.author.avatarURL(), `https://docs.lecashbot.cf/`)
        .setDescription(desc)
        .addField(`Categories`, `\n\`$help Register\`\n\`$help Guides\`\n\`$help Economy\`\n\`$help Games\`\n\`$help Misc\``)
        .setTimestamp(new Date())
        .setFooter(config.footer);

    if (!args[0]) return message.channel.send(helpSplash);

    const category = args.shift().toLowerCase();
    const commands = client.commands.filter(command => command.config.category === category);

    if (!commands || commands.length === 0) return message.channel.send(helpSplash);

    const categoryObj = {};
    for (const command of commands) categoryObj[`${command.name}${command.config.usage !== `` ? ` ${command.config.usage}` : ``}`] = ` - ${command.config.desc}`;

    const sEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setAuthor(`Help Menu`, message.author.avatarURL(), `https://docs.lecashbot.cf/`)
        .setDescription(desc)
        .addField(capitalize(category), `\n${addCommandField(categoryObj)}`)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    message.channel.send(sEmbed);
};

export {
    cmd,
    run
};

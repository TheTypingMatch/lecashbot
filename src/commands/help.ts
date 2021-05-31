import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

import config from '../../config/config';

const cmd: CommandConfig = {
    desc: `View all commands.`,
    category: `guides`
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const m = `${message.author} »`;

    const commands = client.commands;
    const data = [];

    if (!args[0]) {
        let helpTxt = ``;
        commands.forEach(command => {
            helpTxt += `\`${config.prefix + command.name + (command.config.usage ? ` ${command.config.usage}` : ``)}\` - ${command.config.desc}\n`;
        });

        const sEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
            .setColor(config.colors.yellow)
            .setAuthor(`Help Menu`, message.author.avatarURL(), `https://docs.lecashbot.cf/`)
            .setDescription(helpTxt)
            .setTimestamp(new Date())
            .setFooter(config.footer);
        return message.channel.send(sEmbed);
    }

    const commandName = args[0].toLowerCase();
    const command = commands.find(command => command.name === commandName) || commands.find(c => c.config.aliases && c.config.aliases.includes(commandName));

    if (!command) return message.channel.send(`${m} That is not a valid command!`);

    if (command.config.usage) data.push(`**Usage:** \`${config.prefix}${command.name} ${command.config.usage}\``);
    if (command.config.aliases) data.push(`**Aliases:** ${command.config.aliases.join(`, `)}`);

    const sEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.yellow)
        .setAuthor(`Help Menu | ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}`)
        .setDescription(`${command.config.desc}\n\n${data.join(`\n`)}`)
        .setTimestamp(new Date())
        .setFooter(config.footer);
    message.channel.send(sEmbed);
};

export {
    cmd,
    run
};

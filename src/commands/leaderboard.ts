import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

import config from '../../config/config';
import { addCommandField } from '../utils/field';

const cmd: CommandConfig = {
    desc: `View global leaderboards.`,
    category: `economy`,
    usage: `[type]`,
    aliases: [`lb`, `top`]
};

const helpInfo = {
    [`leaderboard bet`]: `- Display the highest bets won.`,
    [`leaderboard streak`]: `- Display the highest daily streaks.`,
    [`leaderboard cash`]: `- Display the wealthiest users.`,
    [`leaderboard coinflip`]: `- Display the luckiest users.`
};

const sendDefaultEmbed = (message: Discord.Message) => {
    const defaultEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setAuthor(`Leaderboard`, message.author.avatarURL())
        .setDescription(addCommandField(helpInfo))
        .setTimestamp(new Date())
        .setFooter(config.footer);
    message.channel.send(defaultEmbed);
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    if (!args[0] || args[0] === `help`) sendDefaultEmbed(message);
};

export {
    cmd,
    run
};

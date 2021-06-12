import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../../types/discord';

import config from '../../../config/config';
import User from '../../models/user.model';

import { formatMoney } from '../../utils/text';

const cmd: CommandConfig = {
    desc: `Claim your daily reward.`,
    category: `economy`,
    usage: ``
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const m = `${message.author} »`;

    const user = await User.findOne({ discordID: message.author.id });
    if (!user) return message.channel.send(`${m} You don't have an account!`);

    const reward = (user.streaks.daily * 25) + 100;

    const sEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setAuthor(`Daily`, message.author.avatarURL())
        .setDescription(`**${message.author.username}** just earned **$${formatMoney(reward)}** with a streak of **${user.streaks.daily + 1}**!\nDon't forget to vote [**here**](https://top.gg/bot/586645522614583306/vote)!`)
        .setTimestamp(new Date())
        .setFooter(config.footer);

    user.streaks.daily++;
    user.balance += reward;
    user.cooldowns.daily = new Date().toString();

    await user.save();
    message.channel.send(sEmbed);
};

export {
    cmd,
    run
};

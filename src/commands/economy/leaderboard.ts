import config from '../../../config/config';

import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../../types/discord';

import Leaderboard from '../../models/leaderboard.model';
import { LeaderboardUser } from '../../types/leaderboard';

import { addCommandField } from '../../utils/field';
import { capitalize, formatMoney } from '../../utils/text';

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

const formatLB = async (message: Discord.Message, type: string) => {
    const lbInfo = await Leaderboard.findOne();
    let content = ``;

    const users: LeaderboardUser[] = lbInfo[type].slice(0, 10);
    users.forEach((user: LeaderboardUser, pos: number) => {
        let data: string;

        switch (type) {
            case `bet`:
                data = `$${formatMoney(user.highestBet)}`;
                break;
            case `cash`:
                data = `$${formatMoney(user.balance)}`;
                break;
            case `coinflip`:
                data = `${formatMoney(user.coinflipStreak)}`;
                break;
            case `daily`:
                data = `${formatMoney(user.dailyStreak)}`;
                break;
            default:
                data = null;
                break;
        }

        content += `${pos < 3 ? [`🥇`, `🥈`, `🥉`][pos] : `🏅`} **${user.discordTag}** - ${data}\n`;
    });

    // console.log(map);
    // if (!users.map((user: any) => user.discordTag).includes(message.author.tag))

    return content;
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const lbTypes = [`bet`, `cash`, `coinflip`, `daily`];
    const lbType = args[0]?.toLowerCase();

    if (!lbType || lbType === `help`) return sendDefaultEmbed(message);
    if (!lbTypes.includes(lbType)) return sendDefaultEmbed(message);

    const lbEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setAuthor(`Leaderboard | ${capitalize(args[0])}`, message.author.avatarURL())
        .setDescription(await formatLB(message, lbType))
        .setTimestamp(new Date())
        .setFooter(config.footer);

    message.channel.send(lbEmbed);
};

export {
    cmd,
    run
};

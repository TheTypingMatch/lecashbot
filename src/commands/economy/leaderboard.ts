import * as Discord from 'discord.js';
import config from '../../../config/config';

import { Client, CommandConfig } from '../../types/discord';
import Leaderboard from '../../models/leaderboard.model';

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

const formatLB = (type: string, users: any[]) => {
    let content = ``;

    // forEach is slower than for...of, but is more practical here. Any ideas?
    users.forEach((user, pos) => {
        let data: string;

        switch (type) {
            case `bet`:
                data = `${user.coinflipStreak}`;
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

    return content;
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    if (!args[0] || args[0] === `help`) return sendDefaultEmbed(message);

    const lbEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setTimestamp(new Date())
        .setFooter(config.footer);

    const lbInfo = await Leaderboard.findOne({});

    switch (args[0]) {
        case `bet`:
            lbEmbed.setDescription(formatLB(`bet`, lbInfo.bet.splice(0, 10)));
            break;
        case `cash`:
            lbEmbed.setDescription(formatLB(`cash`, lbInfo.balance.splice(0, 10)));
            break;
        case `coinflip`:
            lbEmbed.setDescription(formatLB(`coinflip`, lbInfo.coinflip.splice(0, 10)));
            break;
        case `daily`:
            lbEmbed.setDescription(formatLB(`daily`, lbInfo.daily.splice(0, 10)));
            break;
        default:
            return sendDefaultEmbed(message);
    }

    lbEmbed.setAuthor(`Leaderboard | ${capitalize(args[0])}`, message.author.avatarURL());
    message.channel.send(lbEmbed);
};

export {
    cmd,
    run
};

import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

import config from '../../config/config';

import { addCommandField } from '../utils/field';
import { formatMoney } from '../utils/text';
import Leaderboard from '../models/leaderboard.model';

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

// const formatFlipLB = (msg, topTen) => {
//     topTen.reverse().forEach(({ coinflipBestStreak, name }, pos) => {
//         const coinflipAmount = (coinflipBestStreak) ? Math.round((100 * (3 ** (coinflipBestStreak - 2))) + ((coinflipBestStreak - 1) * 150)) : 0;
//         const coinflipChance = (coinflipBestStreak) ? Math.round((100 / (2 ** coinflipBestStreak)) * 100) / 100 : 0;

//         desc += `#**${pos + 1}** ${name} - **${coinflipBestStreak}** - $**${currency(coinflipAmount)}** - ${coinflipChance}%\n`;
//     });
// };

// const formatBetLB = (msg, topTen) => {
//     topTen.reverse().forEach(({ highestBet, name }, pos) => {
//         const betAmount = currency(highestBet.amount);
//         const betChance = Math.round(highestBet.chance * 100) / 100;
//         desc += `#**${pos + 1}** ${name} - $**${betAmount}** - ${betChance}%\n`;
//     });
// };

const formatCashLB = (msg, topTen) => {
    let content = ``;
    topTen.reverse().forEach((user, pos) => {
        content += `#**${pos + 1}** ${user.name} - $**${formatMoney(user.balance)}**\n`;
    });

    return content;
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    if (!args[0] || args[0] === `help`) return sendDefaultEmbed(message);

    const lbEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setAuthor(`Leaderboard`)
        .setTimestamp(new Date())
        .setFooter(config.footer);

    const lbInfo = await Leaderboard.findOne({});
    console.log(lbInfo);

    switch (args[0]) {
        case `cash`:
            lbEmbed.setDescription(formatCashLB(message, lbInfo.balance));
            break;
        default:
            return sendDefaultEmbed(message);
    }

    message.channel.send(lbEmbed);
};

export {
    cmd,
    run
};

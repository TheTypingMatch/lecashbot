import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../../types/discord';

import config from '../../../config/config';
import log from '../../utils/log';

import { capitalize, formatMoney, formatTimeString } from '../../utils/text';

import User from '../../models/user.model';
import Lottery from '../../models/lottery.model';

const cmd: CommandConfig = {
    desc: `Enter a lottery.`,
    category: `economy`,
    usage: `<type> [enter]`,
    aliases: [`lb`, `top`]
};

const entryFees = {
    daily: 1000,
    weekly: 5000,
    monthly: 25000
};

const enterUser = async (client: Client, message: Discord.Message, type: string, cost: number) => {
    const m = `${message.author} »`;

    const lottery = await Lottery.findOne({ type });
    const user = await User.findOne({ discordID: message.author.id });

    if (!lottery) return message.channel.send(`${m} That lottery does not exist!`);
    if (lottery.entries.includes(message.author.id)) return message.channel.send(`${m} You have already entered!`);

    if (user.balance < cost) return message.channel.send(`${m} You do not have enough money to enter this lottery!`);

    log(`blue`, `${message.author.tag} entered the ${type} lottery.`);

    user.balance -= cost;
    lottery.entries.push(message.author.id);

    await user.save();
    await lottery.save();

    message.channel.send(`${m} You have entered the ${type} lottery!`);
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const m = `${message.author} »`;

    const lotteryTypes = [`daily`, `weekly`, `monthly`];
    const lotteryChoice = args[0].toLowerCase();

    if (!lotteryTypes.includes(lotteryChoice)) return message.channel.send(`${m} That is an invalid lottery type!`);
    if (args[1] && args[1] === `enter`) return await enterUser(client, message, lotteryChoice, entryFees[lotteryChoice]);

    const lotteryEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setAuthor(`Lottery`, message.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(config.footer);

    const lottery = await Lottery.findOne({ type: lotteryChoice });
    const prizePool = lottery.entryFee * lottery.entries.length;

    const previousWinner = lottery.previousWinner ? `**${lottery.previousWinner}**` : `No entries in previous lottery.`;
    const timeLeft = formatTimeString(new Date(lottery.endDate).valueOf() - new Date().valueOf());

    lotteryEmbed.setDescription(`
        **${capitalize(lotteryChoice)}**
        ${lottery.entries.includes(message.author.id) ? `You have entered this lottery!` : `To enter this lottery, type \`${config.prefix}lottery <type> enter\`.`}
        Ends in ${timeLeft}

        **Entry Fee**: $${formatMoney(lottery.entryFee)}
        **Prize Pool**: $${formatMoney(prizePool) || `Error`}

        **Entries**: ${lottery.entries.length}
        **Previous Winner**: ${previousWinner}
    `);

    message.channel.send(lotteryEmbed);
};

export {
    cmd,
    run
};

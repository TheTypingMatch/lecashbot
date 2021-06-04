import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

import config from '../../config/config';
import User from '../models/user.model';

import { formatMoney } from '../utils/text';
import log from '../utils/log';

const cmd: CommandConfig = {
    desc: `Flip a coin for money.`,
    category: `economy`,
    usage: `[take]`,
    aliases: [`cf`]
};

const calcCost = (coinflipStreak: number) => coinflipStreak !== 0 ? Math.round(100 * (2 ^ (coinflipStreak))) : 0;
const calcReward = (coinflipStreak: number) => Math.round(100 * (3 ^ coinflipStreak) + ((coinflipStreak) * 150));
const calcStreakBonus = (coinflipStreak: number) => Math.round((100 / (2 ** (coinflipStreak + 1))) * 100) / 100;

const sendReward = (message: Discord.Message, user: any, embed: Discord.MessageEmbed, recordEmbed: Discord.MessageEmbed) => {
    const cost = calcCost(user.streaks.coinflip);
    const reward = calcReward(user.streaks.coinflip);

    const streakChance = calcStreakBonus(user.streaks.coinflip); // This is super inaccurate???
    const profit = reward - cost;

    if (user.balance < cost) {
        embed.setColor(config.colors.orange);
        embed.setDescription(`You do not have enough money to coinflip!`);
        return message.channel.send(embed);
    }

    log(`blue`, `${message.author.tag} [${message.author.id}] coinflipped with a streak of ${user.streaks.coinflip} and won.`);

    const nextCost = calcCost(user.streaks.coinflip + 1);
    const nextReward = calcReward(user.streaks.coinflip + 1);

    const description = {
        reward: `**${message.author.username}** just earned **$${formatMoney(reward)}**`,
        streak: `with a streak of **${user.streaks.coinflip + 1}**!`,
        chance: `The chances of winning this is **${streakChance}%**!`,
        nextCostMsg: `Your next coinflip will cost **$${formatMoney(nextCost)}**.`,
        nextRewardMsg: `If you win it, you will win **$${formatMoney(nextReward)}**.`
    };

    const embedDesc = `${description.reward} ${description.streak}\n${description.chance}\n\n${description.nextCostMsg}\n${description.nextRewardMsg}`;

    if (user.streaks.coinflip + 1 > user.highscores.coinflip) {
        user.highscores.coinflip++;

        recordEmbed.setDescription(`New highest coinflip streak of **${user.streaks.coinflip + 1}**!`);
        message.channel.send(recordEmbed);
    }

    user.balance += profit;
    user.streaks.coinflip++;

    user.save();

    embed.setColor(config.colors.green).setDescription(embedDesc);
    message.channel.send(embed);
};

const sendLoss = (message: Discord.Message, user: any, embed: Discord.MessageEmbed) => {
    const cost = calcCost(user.streaks.coinflip);

    if (user.balance < cost) {
        embed.setColor(config.colors.orange).setDescription(`You do not have enough money to coinflip!`);
        return message.channel.send(embed);
    }

    embed
        .setColor(config.colors.red)
        .setDescription(
            user.streaks.coinflip
                ? `You  lost your streak and **$${formatMoney(cost)}**!`
                : `Your streak remains at 0.`
        );

    user.balance -= cost;
    user.streaks.coinflip = 0;

    message.channel.send(embed);
    user.save();
};

const takeReward = (message: Discord.Message, client: Client, user: any, embed: Discord.MessageEmbed) => {
    embed.setColor(config.colors.green).setDescription(`You took your reward!`);

    user.balance += calcReward(user.streaks.coinflip);
    user.streaks.coinflip = 0;

    user.save();
    message.channel.send(embed);
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const m = `${message.author} »`;
    const flip = Math.random();

    const user = await User.findOne({ discordID: message.author.id });
    if (!user) return message.channel.send(`${m} You don't have an account!`);

    const recordEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setAuthor(`New Highest Streak!`, message.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(config.footer);

    const flipEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setAuthor(`Coinflip`, message.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(config.footer);

    if (args[0]?.toLowerCase() === `take`) {
        return user.streaks.coinflip > 2
            ? takeReward(message, client, user, flipEmbed)
            : message.channel.send(flipEmbed.setColor(config.colors.yellow).setDescription(`Your streak is not high enough!`));
    }

    return flip > 0.499
        ? sendReward(message, user, flipEmbed, recordEmbed)
        : sendLoss(message, user, flipEmbed);
};

export {
    cmd,
    run
};

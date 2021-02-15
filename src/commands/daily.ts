import * as cooldowns from "../config/cooldowns";
import { User } from "../models/user.model";
import { checkErr } from "../utils/checkErr";
import { MessageEmbed } from "discord.js";
import { colors, version } from "../config/config";
import { toHours, toMinutes } from "../utils/date";
import { currency } from "../utils/format";

const sendReward = (msg, user, client, embed) => {
    const { name, balance, dailyStreak, cooldowns } = user;
    const userId: { discordId: string } = { discordId: msg.author.id };

    const reward: number = (dailyStreak * 25) + 100;
    cooldowns.daily = new Date();

    client.logger.ready(`${user.name} (${user.discordId}) collected their daily streak of ${dailyStreak}.`);

    embed
        .setColor(colors.green)
        .setDescription(`**${name}** just earned $**${currency(reward)}** with a streak of **${dailyStreak + 1}**!\nDon't forget to vote [**here**](https://top.gg/bot/586645522614583306/vote)!`);

    return User.updateOne(userId, {
        balance: balance + reward,
        dailyStreak: dailyStreak + 1,
        cooldowns: cooldowns
    }, (err: any) => checkErr(err, client, () => msg.channel.send(embed)));
};

const sendTimeLeft = (msg, dailyCooldown, embed) => {
    let timeLength = "seconds";
    let timeLeft: number = cooldowns.daily - dailyCooldown;

    if ((timeLeft / 1000) > 60 && toHours(timeLeft) < 1) {
        timeLength = "minutes";
        timeLeft = toMinutes(timeLeft);
    } else if (toHours(timeLeft) > 1) {
        timeLength = "hours";
        timeLeft = toHours(timeLeft);
    } else timeLeft = timeLeft / 1000;

    embed
        .setColor(colors.yellow)
        .setDescription(`You can collect your daily reward in **${Math.ceil(timeLeft)}** ${timeLength}`);

    return msg.channel.send(embed);
};

export default async (msg, client, args) => {
    const user: any = await User.findOne({ discordId: msg.author.id });

    const lastDaily: any = user.cooldowns.daily;
    const dailyCooldown: number = new Date().getTime() - lastDaily;
    const isWithinTimeout: boolean = (user && dailyCooldown >= cooldowns.daily);

    const dailyEmbed = new MessageEmbed()
        .setAuthor("Daily", msg.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`);

    return (isWithinTimeout)
        ? sendReward(msg, user, client, dailyEmbed)
        : sendTimeLeft(msg, dailyCooldown, dailyEmbed);
};

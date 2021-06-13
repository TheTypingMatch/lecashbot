import config from '../../config/config';

import Lottery from '../models/lottery.model';
import User from '../models/user.model';

import { capitalize, formatMoney } from '../utils/text';
import log from '../utils/log';

import { Client } from '../types/discord';
import { MessageEmbed } from 'discord.js';

const createLottery = async (type: string, client: Client) => {
    const tomorrow = new Date().getTime() + 864e5;
    const nextWeek = new Date().getTime() + 6048e5;
    const nextMonth = new Date().getTime() + 2592e6;

    const entryFees = {
        daily: 1e3,
        weekly: 5000,
        monthly: 25000
    };

    const endDates = {
        daily: tomorrow,
        weekly: nextWeek,
        monthly: nextMonth
    };

    const newLottery = new Lottery({
        type,
        endDate: new Date(endDates[type]),
        entryFee: entryFees[type]
    });

    newLottery.save();
    log(`yellow`, `created ${type} lottery.`);
};

const resetLottery = async (type: string) => {
    const tomorrow = new Date().getTime() + 864e5;
    const nextWeek = new Date().getTime() + 6048e5;
    const nextMonth = new Date().getTime() + 2592e6;

    const endDates = {
        daily: tomorrow,
        weekly: nextWeek,
        monthly: nextMonth
    };

    await Lottery.updateOne({ type }, {
        endDate: new Date(endDates[type]).toString(),
        entries: []
    });
};

const endLottery = async (client: Client, type: string) => {
    const lottery = await Lottery.findOne({ type });

    if (lottery.entries.length === 0) return await resetLottery(type);

    const winnerID = lottery.entries[Math.floor(Math.random() * lottery.entries.length)];

    const winner = await User.findOne({ discordID: winnerID });
    const winnerUser = await client.users.fetch(winnerID);

    const prize = formatMoney(lottery.entryFee * lottery.entries.length);

    await User.updateOne({ discordID: winnerID }, { balance: winner.balance + (lottery.entryFee * lottery.entries.length) });
    await Lottery.updateOne({ type }, { previousWinner: (winnerUser?.tag || winner.username) });

    const winnerEmbed: MessageEmbed = new MessageEmbed()
        .setColor(config.colors.green)
        .setAuthor(`${capitalize(type)} Lottery Winner!`)
        .addField(`Winner`, `${winnerUser?.tag || winner.username}`, true)
        .addField(`Prize`, `$${prize}`)
        .setTimestamp(new Date())
        .setFooter(config.footer);

    for (const userID of lottery.entries) {
        const user = await client.users.fetch(userID);

        if (!user) log(`yellow`, `Unable to send user lottery winner.`);
        else user.send(winnerEmbed).catch(() => log(`yellow`, `Unable to send user lottery winner.`));
    }

    return resetLottery(type);
};

const updateLottery = async (client: Client, callback?: any) => {
    log(`cyan`, `Updating lottery...`);

    const lotteryTypes = [`daily`, `weekly`, `monthly`];
    for (const type of lotteryTypes) {
        const lottery = await Lottery.findOne({ type });
        if (!lottery) {
            await createLottery(type, client);
            continue;
        }

        const timeLeft = new Date(lottery.endDate).valueOf() - new Date().valueOf();
        if (timeLeft <= 0) await endLottery(client, type);
    }

    log(`green`, `Lotteries updated.`);
    if (callback !== undefined) callback();
};

export default updateLottery;

import { Lottery } from '../../models/lottery.model';
import { User } from '../../models/user.model';
import { currency, capitalize } from '../../utils/format';
import { MessageEmbed } from 'discord.js';
import { subtractDate } from '../../utils/date';
import { colors, version } from '../../config/config';

export default async (client) => {
    client.logger.log('Updating lottery...', 'log');

    const lotteryTypes = ['daily', 'weekly', 'monthly'];
    for (const type of lotteryTypes) {
        const lottery = await Lottery.findOne({ type });

        if (lottery === undefined || lottery === null) {
            await createLottery(type, client);
            continue;
        }

        const timeLeft = subtractDate(lottery.endDate);

        if (timeLeft <= 0) {
            await endLottery(client, type);
        }

        client.logger.ready(`Done updating ${type} lottery.`)
    }

    client.logger.ready('Done updating lotteries.');
};

const createLottery = async (type, client) => {
    const now = new Date();
    const tomorrow = new Date().getTime() + 24 * 60 * 60 * 1000;
    const nextWeek = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
    const nextMonth = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;

    const entryFees = {
        daily: 1000,
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
    client.logger.ready(`Created ${type} lottery.`);
};

const resetLottery = async type => {
    const now = new Date();
    const tomorrow = new Date().getTime() + 24 * 60 * 60 * 1000;
    const nextWeek = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
    const nextMonth = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;

    const endDates = {
        daily: tomorrow,
        weekly: nextWeek,
        monthly: nextMonth
    };

    await Lottery.updateOne({ type }, {
        endDate: new Date(endDates[type]),
        entries: []
    });
};

const endLottery = async (client, type) => {
    const lottery = await Lottery.findOne({ type });
    const { entries } = lottery;

    if (entries.length === 0) {
        return await resetLottery(type);
    }

    const winnerId = entries[Math.floor(Math.random() * entries.length)];
    const winner = await User.findOne({ discordId: winnerId });
    const prize = currency(lottery.entryFee * entries.length);
    await User.updateOne({ discordId: winnerId }, {
        balance: winner.balance + (lottery.entryFee * entries.length)
    });

    const winnerEmbed = new MessageEmbed()
        .setAuthor(`${capitalize(type)} Lottery Winner!`)
        .setTimestamp(new Date())
        .setColor(colors.green)
        .setFooter(`LeCashBot v${version}`)
        .addField('Winner', `${winner.name}`)
        .addField('Prize', `$**${prize}**`);

    for (const userId of entries) {
        const user = client.users.cache.get(userId);

        if (!user) {
            client.logger.error('Unable to send user lottery winner.');
            break;
        }

        user.send(winnerEmbed);
    }

    client.logger.ready(`(${winnerId}) won the ${type} lottery: $${prize}`);

    return resetLottery(type);
};

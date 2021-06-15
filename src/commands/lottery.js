import { User } from '../models/user.model';
import { Lottery } from '../models/lottery.model';
import { MessageEmbed } from 'discord.js';
import { colors, version } from '../config/config';
import { currency, capitalize } from '../utils/format';
import { msgCooldown } from '../config/cooldowns';
import { formatTime, subtractDate } from '../utils/date';

const entryFees = {
    daily: 1000,
    weekly: 5000,
    monthly: 25000
};

const enterUser = async (client, msg, type, cost) => {
    const lottery = await Lottery.findOne({ type });
    const user = await User.findOne({ discordId: msg.author.id });
    const userFee = cost + lottery.entries.filter(id => id == msg.author.id).length * (cost * 0.05)

    if (user.balance < userFee) {
        return msg.reply('You do not have enough to enter this lottery.');
    };

    client.logger.log(`(${msg.author.id}) entered the ${type} lottery.`);
    await User.updateOne({ discordId: msg.author.id }, {
        balance: user.balance - userFee
    });

    await Lottery.updateOne({ type }, {
        entries: [...lottery.entries, msg.author.id]
    });

    return msg.reply('You have been entered! 🍀');
};

export default async (msg, client, args) => {
    const lotteryTypes = ['daily', 'weekly', 'monthly'];
    const lotteryChoice = (args[0]) ? args[0].toLowerCase() : '';

    if (args[1] === 'enter' && lotteryTypes.includes(lotteryChoice)) {
        return await enterUser(client, msg, lotteryChoice, entryFees[lotteryChoice]);
    };

    const lotteryEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setFooter(`LeCashBot v${version}`)
        .setAuthor('Lottery!', msg.author.avatarURL())
        .setTimestamp(new Date());

    const description = '';
    for (const type of lotteryTypes) {
        const lottery = await Lottery.findOne({ type });
        const timeLeft = formatTime(subtractDate(lottery.endDate));
        const prizePool = (lottery.entryFee || 0) * (lottery.entries.length || 0);
        const userFee = lottery.entries.filter(id => id == msg.author.id).length * (lottery.entryFee * 0.05);
        const numOfEntries = lottery.entries.filter(id => id == msg.author.id).length;
        const previousWinner = lottery.previousWinner ? `**${lottery.previousWinner}**` : '*No entries in previous lottery.*';

        lotteryEmbed.addField(`
            **${capitalize(type)}**`, `
            Ends in: ${timeLeft}
            Entries: **${lottery.entries.length}**
            Entered: **${lottery.entries.includes(msg.author.id) ? `Yes - ${numOfEntries} entr${numOfEntries > 1 ? "ies" : "y"}` : 'No'}**
            Entry Fee: **$${currency(lottery.entryFee)}${numOfEntries == 0 ? "" : ` + $${userFee}`}**
            Prize Pool: **$${currency(prizePool) || 'Error'}**
            Previous Winner: ${previousWinner}
        `);
    };

    lotteryEmbed.setDescription(`
        **How to Enter**
        \`$lottery <type> enter\` (e.g. \`$lottery daily enter\`)
    `);

  return msg.channel.send(lotteryEmbed);
};

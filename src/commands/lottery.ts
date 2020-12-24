import { User } from '../models/user.model';
import { Lottery } from '../models/lottery.model';
import { MessageEmbed } from 'discord.js';
import { colors, version } from '../config/config';
import { currency } from '../utils/format';
import { msgCooldown } from '../config/cooldowns';

const entryFees = {
    daily: 1000,
    weekly: 5000,
    monthly: 25000
};

// capitalize first letter
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

// calculate time between now and end date
const subtractDate = endDate => {
    const now = new Date();
    let timeLeft = endDate.getTime() - now.getTime();

    if (timeLeft < 0) {
        timeLeft = 0;
    }

    return timeLeft;
};

const enterUser = async (client, msg, type, cost) => {
    const lottery = await Lottery.findOne({ type });
    const user = await User.findOne({ discordId: msg.author.id });

    if (lottery.entries.includes(msg.author.id)) {
        return msg.reply('You are already entered!');
    }

    if (user.balance < cost) {
        return msg.reply('You do not have enough to enter this lottery.');
    }

    client.logger.log(`(${msg.author.id}) entered the ${type} lottery.`);
    await User.updateOne({ discordId: msg.author.id }, {
        balance: user.balance - cost
    });

    await Lottery.updateOne({ type }, {
        entries: [...lottery.entries, msg.author.id]
    });

    return msg.reply('You have been entered! 🍀');
};

// format time to dd:hh:mm:ss
const formatTime = ms => {
    let seconds = parseInt((ms / 1000) % 60);
    let minutes = parseInt((ms / (1000 * 60)) % 60);
    let hours = parseInt((ms / (1000 * 60 * 60)) % 24);
    const days = parseInt((ms / (1000 * 60 * 60 * 24)) % 365);

    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;

    return `${days ? `${days}:` : ''}${hours}:${minutes}:${seconds}`;
};

export default async (msg, client, args) => {
    const lotteryTypes = ['daily', 'weekly', 'monthly'];
    const lotteryChoice = (args[0]) ? args[0].toLowerCase() : '';

    if (args[1] === 'enter' && lotteryTypes.includes(lotteryChoice)) {
        return await enterUser(client, msg, lotteryChoice, entryFees[lotteryChoice]);
    }

    const lotteryEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setFooter(`LeCashBot v${version}`)
        .setAuthor('Lottery!', msg.author.avatarURL())
        .setTimestamp(new Date());

    const description = '';
    for (const type of lotteryTypes) {
        const lottery = await Lottery.findOne({ type });
        const timeLeft: string = formatTime(subtractDate(lottery.endDate));
        const prizePool: number = (lottery.entryFee || 0) * (lottery.entries.length || 0);

        lotteryEmbed.addField(`
            **${capitalize(type)}**`, `
            Ends in: \`${timeLeft}\`
            Entries: **${lottery.entries.length}**
            Entry Fee: **$${currency(lottery.entryFee)}**
            Prize Pool: $**${currency(prizePool) || 'Error'}**
        `);
    }

    lotteryEmbed.setDescription(`
        **How to Enter**
        \`$lottery <type> enter\` (e.g. \`$lottery daily enter\`)
    `);

    return msg.channel.send(lotteryEmbed);
};

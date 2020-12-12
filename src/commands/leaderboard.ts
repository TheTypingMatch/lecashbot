import { User } from '../models/user.model';
import { MessageEmbed } from 'discord.js';
import { colors, version } from '../config/config';
import { currency } from '../utils/format';
import { addCommandField } from '../utils/field';
import { log } from '../utils/log';

const helpInfo: any = {
    'leaderboard bet': '- Display the highest bets won.',
    'leaderboard streak': '- Display the highest daily streaks.',
    'leaderboard cash': '- Display the wealthiest users.',
    'leaderboard coinflip': 'Display the luckiest users.'
};

let desc = '';
const lbEmbed = new MessageEmbed()
    .setColor(colors.green)
    .setAuthor('Leaderboard')
    .setFooter(`LeCashBot v${version}`);

const getTopTen = (arr: any[]) => arr.slice(-10).reverse();

// The sort type is the property of users that the function sorts by
const sortUsers = (users: any[], sortType: string) => {
    return users.sort((a, b) => {
        return (a[sortType] > b[sortType]) ? 1 : (
            (b[sortType] > a[sortType]) ? -1 : 0
        );
    });
};

const handleFlipLb = (msg, users: any[]) => {
    const sortedUsers = users.sort((a, b) => {
        const aStreak: number = a.coinflipBestStreak;
        const bStreak: number = b.coinflipBestStreak;
        return (aStreak > bStreak) ? 1 : ((bStreak > aStreak) ? -1 : 0);
    });
    const topTen: any = getTopTen(sortedUsers);

    let userPosition: any = 'You are not ranked!';
    let userStreak: any = 'N/A';
    let userEarnings: any = 'N/A';
    let userStreakChance: any = 'N/A';
    sortedUsers.reverse().forEach((user, index) => {
        if (user.discordId === msg.author.id) {
            userPosition = index + 1;
            userStreak = user.coinflipBestStreak;
            userStreakChance = Math.round((100 / (2 ** user.coinflipBestStreak)) * 100) / 100;
            return userEarnings = (user.coinflipBestStreak)
                ? Math.round((100 * (3 ** (user.coinflipBestStreak - 2))) + ((user.coinflipBestStreak - 1) * 150))
                : 0;
        }
    });

    topTen.forEach(({ coinflipBestStreak, name }, pos) => {
        const coinflipAmount: number = (coinflipBestStreak) ? Math.round((100 * (3 ** (coinflipBestStreak - 2))) + ((coinflipBestStreak - 1) * 150)) : 0;
        const coinflipChance: number = (coinflipBestStreak) ? Math.round((100 / (2 ** coinflipBestStreak)) * 100) / 100 : 0;
        desc += `#**${pos + 1}** ${name} - **${coinflipBestStreak}** - $**${currency(coinflipAmount)}** - ${coinflipChance}%\n`;
    });
    desc += `#**${userPosition}** - YOU - **${currency(userStreak)}** - $**${currency(userEarnings)}** - ${userStreakChance}%`;

    lbEmbed.setDescription(desc);
    desc = '';

    return msg.channel.send(lbEmbed.setTimestamp(new Date()));
};

const handleBetLb = (msg, users: any[]) => {
    const sortedUsers = users.sort((a, b) => {
        const aBet: number = a.highestBet.amount;
        const bBet: number = b.highestBet.amount;
        return (aBet > bBet) ? 1 : ((bBet > aBet) ? -1 : 0);
    });
    const topTen: any = getTopTen(sortedUsers);

    let userPosition: any = 'You are not ranked!';
    let userBet: any = 'N/A';
    let userBetChance: any = 'N/A';
    sortedUsers.reverse().forEach((user, index) => {
        if (user.discordId === msg.author.id) {
            userPosition = index + 1;
            userBet = user.highestBet.amount;
            userBetChance = Math.round(user.highestBet.chance * 100) / 100;
        }
    });

    topTen.forEach(({ highestBet, name }, pos) => {
        const betAmount: string = currency(highestBet.amount);
        const betChance: number = Math.round(highestBet.chance * 100) / 100;
        desc += `#**${pos + 1}** ${name} - $**${betAmount}** - ${betChance}%\n`;
    });
    desc += `#**${userPosition}** - YOU - $**${currency(userBet)}** - ${userBetChance}%`;

    lbEmbed.setDescription(desc);
    desc = '';

    return msg.channel.send(lbEmbed.setTimestamp(new Date()));
};

const handleCashLb = (msg, users) => {
    const sortedUsers: any = sortUsers(users, 'balance');
    const topTen: any = getTopTen(sortedUsers);

    let userPosition: any = 'N/A';
    let userBalance: any = 'N/A';
    sortedUsers.reverse().forEach(({
        discordId,
        balance
    }, index: number) => {
        if (discordId === msg.author.id) {
            userPosition = index + 1;
            userBalance = balance;
        }
    });

    topTen.forEach((user, pos: number) => {
        desc += `#**${pos + 1}** ${user.name} - $**${currency(user.balance)}**\n`;
    });
    desc += `#**${userPosition}** - YOU - $**${currency(userBalance)}**`;
    lbEmbed.setDescription(desc);
    desc = '';

    return msg.channel.send(lbEmbed.setTimestamp(new Date()));
};

const handleStreakLb = (msg, users) => {
    const sortedUsers = sortUsers(users, 'dailyStreak');
    const topTen = getTopTen(sortedUsers);

    let userPosition: any = 'N/A';
    let userStreak: any = 'N/A';
    sortedUsers.reverse().forEach(({
        discordId,
        dailyStreak
    }, index) => {
        if (discordId === msg.author.id) {
            userPosition = index + 1;
            userStreak = dailyStreak;
        }
    });

    topTen.forEach((user, pos) => {
        desc += `#**${pos + 1}** ${user.name} - **${currency(user.dailyStreak)}**\n`;
    });
    desc += `#**${userPosition}** - YOU - **${currency(userStreak)}**`;
    lbEmbed.setDescription(desc);
    desc = '';

    return msg.channel.send(lbEmbed.setTimestamp(new Date()));
};

const handleHelpLb = msg => {
    const lbHelpEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor('Leaderboard')
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(addCommandField(helpInfo));

    return msg.channel.send(lbHelpEmbed.setTimestamp(new Date()));
};

export default async (msg, client, args) => {
    const users: any = await User.find({ banned: false });
    if (!users) log('error', `ERROR: DB could not find users:\n**${users}**`, client);

    switch (args[0]) {
        case 'cash': return handleCashLb(msg, users);
        case 'bet': return handleBetLb(msg, users);
        case 'streak': return handleStreakLb(msg, users);
        case 'coinflip': return handleFlipLb(msg, users);
        case 'help': return handleHelpLb(msg);
        default: return handleCashLb(msg, users);
    }
};

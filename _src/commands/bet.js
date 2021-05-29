import { User } from '../models/user.model';
import { checkErr } from '../utils/checkErr';
import { MessageEmbed } from 'discord.js';
import { colors, version } from '../config/config';
import { currency, int } from '../utils/format';

const sendRecordEmbed = (msg, previousBet) => {
    const recordBetEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor('New Highest Bet!', msg.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(`Previous best: $**${currency(previousBet)}**`);

    msg.channel.send(recordBetEmbed);
};

const sendBetEmbed = (msg, bet, didWin) => {
    const betEmbed = new MessageEmbed()
        .setColor(didWin[0] ? colors.green : colors.red)
        .setAuthor('Bet', msg.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(`You ${(didWin[0]) ? 'won' : 'lost'} $**${currency(bet)}**.`)
        .addField('Chances', `**${Math.round(didWin[1] * 100) / 100}**%`);

    msg.channel.send(betEmbed);
};

const getHighestBet = async msg => {
    const user = await User.findOne({ discordId: msg.author.id });
    const bestBet = user.highestBet;
    const message = `Your highest bet is $**${currency(bestBet.amount)}** with a chance of **${bestBet.chance}**%.`;

    return msg.channel.send(message);
};

const win = bet => {
    const chances = Math.round((695 / bet) + (695 / Math.sqrt(bet)) * 100) / 100 + 3;
    const randomNum = Math.random() * 100;

    return [(randomNum < chances), chances];
};

const makeBet = async (msg, user, bet, client) => {
    const didWin = win(bet);
    sendBetEmbed(msg, bet, didWin);

    client.logger.ready(`${user.name} (${user.discordId}) bet $${bet} and ${didWin[0] ? 'won' : 'lost'}.`);

    const previousBet = user.highestBet.amount;
    const previousBal = user.balance;
    const userId = { discordId: msg.author.id };

    if (previousBet < bet && didWin[0]) {
        User.updateOne(userId, {
            highestBet: {
                chance: didWin[1],
                amount: bet
            }
        }, err => checkErr(err, client, () => sendRecordEmbed(msg, previousBet)));
    }

    User.updateOne(userId, {
        balance: (didWin[0]) ? (previousBal + bet) : (previousBal - bet)
    }, err => {
        if (err) {
            client.logger.log('Error updating user balance after betting.', 'error');
        }
    });
};

export default async (msg, client, args) => {
    if (!args[0] || !int(args[0])) return msg.reply('Undefined bet amount: Use `$bet <amount>`.');
    if (args[0] === 'high') return getHighestBet(msg);

    const user = await User.findOne({ discordId: msg.author.id });
    if (!user) {
        client.logger.log('User not found while betting.', 'error');
        return msg.channel.send('An error occurred.');
    }

    const bet = int(args[0]);
    if (bet < 250) {
        return msg.reply('Bets must be at least $250!');
    }

    // Check if the user has enough in their balance to bet.
    return (user.balance >= bet)
        ? makeBet(msg, user, bet, client)
        : msg.reply(`Insufficient bal: $**${user.balance}**`);
};

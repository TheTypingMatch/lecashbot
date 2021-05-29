import { User } from '../models/user.model';
import { checkErr } from '../utils/checkErr';
import { MessageEmbed } from 'discord.js';
import { colors, version } from '../config/config';
import { currency, int } from '../utils/format';

let statusColor = colors.yellow;
let message = ``;

const withdrawAmount = (client, msg, user, amount, notifEmbed) => {
    User.updateOne({ discordId: msg.author.id }, {
        balance: user.balance - amount
    }, err => checkErr(err, client, () => {
        statusColor = colors.red;
        message = `An error occurred.`;
    }));
    client.users.cache.get(`296862365503193098`).send(notifEmbed);
};

export default async (msg, client, args) => {
    if (!args[0] || !int(args[0])) return msg.reply(`No amount given. Use \`$withdraw <amount>\`.`);

    const amount = int(args[0]);
    const userId = { discordId: msg.author.id };
    const user = await User.findOne(userId);
    const userBal = user.balance;

    message = `You have withdrawn $**${currency(amount)}**. It will be sent to your NitroType account soon.`;

    const notifEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor(`Withdraw`, msg.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(`$**${currency(amount)}** withdrawn to [${user.name}](${user.nitroTypeLink}).`);

    if (userBal < 100000) {
        message = `You do not have enough money to withdraw: $**100,000** minimum`;
    } else if (userBal < amount) {
        message = `You do not have enough cash: $**${currency(userBal)}**`;
    } else if (amount < 100000) {
        message = `You must withdraw at least $**100,000**.`;
    } else {
        withdrawAmount(client, msg, user, amount, notifEmbed);
        statusColor = colors.green;
    }

    client.logger.ready(`${user.name} (${user.discordId}) withdrew $${currency(amount)}.`);

    const withdrawEmbed = new MessageEmbed()
        .setColor(statusColor)
        .setAuthor(`Withdraw`, msg.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(message);

    return msg.channel.send(withdrawEmbed);
};

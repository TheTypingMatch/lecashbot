import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

import config from '../../config/config';

import User from '../models/user.model';
import { formatMoney } from '../utils/text';

const cmd: CommandConfig = {
    desc: `Withdraw money to your Nitro Type account.`,
    category: `guides`,
    usage: `<amount>`
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const m = `${message.author} »`;
    const amount = parseInt(args[0]);

    if (isNaN(amount)) return message.channel.send(`${m} Invalid amount given.`);
    if (amount < 1e5) return message.channel.send(`${m} You must withdraw at least \`$100,000!\``);

    const user = await User.findOne({ discordID: message.author.id });
    if (!user) return message.channel.send(`${m} You don't have an account!`);

    if (user.balance < amount) return message.channel.send(`${m} You do not have enough money to withdraw!`);

    const notifEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setAuthor(`Withdraw`, message.author.avatarURL())
        .setDescription(`**$${formatMoney(amount)} withdrawn from **${message.author.username}**'s account.`)
        .setTimestamp(new Date())
        .setFooter(config.footer);

    const withdrawEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.orange)
        .setAuthor(`Withdraw`, message.author.avatarURL())
        .setDescription(``)
        .setTimestamp(new Date())
        .setFooter(config.footer);

    user.balance -= amount;
    await user.save();

    client.users.fetch(`296862365503193098`).then(user => user.send(notifEmbed));
    message.channel.send(withdrawEmbed);
};

export {
    cmd,
    run
};

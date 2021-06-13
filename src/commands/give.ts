import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

import config from '../../config/config';
import User from '../models/user.model';
import log from '../utils/log';

import getQuery from '../utils/getQuery';
import { formatMoney } from '../utils/text';

const cmd: CommandConfig = {
    desc: `Gift another user money.`,
    category: `economy`,
    usage: `<user> <amount>`
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const m = `${message.author} »`;

    const query = getQuery(message, args);

    const takeUser = await User.findOne({ discordID: message.author.id });
    const giveUser = await User.findOne(query);

    if (!takeUser) return message.channel.send(`${m} You do not have an account!`);
    if (!giveUser) return message.channel.send(`${m} That user does not have an account!`);

    if (takeUser.discordID === giveUser.discordID) return message.channel.send(`${m} You cannot gift money to yourself!`);

    const discordUser = await client.users.fetch(giveUser.discordID);
    const amount = parseInt(args[1]);

    if (isNaN(amount)) return message.channel.send(`${m} Invalid amount!`);
    if (amount < 100) return message.channel.send(`${m} You must gift at least **$100**!`);

    const sEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setAuthor(`Transaction Successful`, message.author.avatarURL())
        .setDescription(`You have succesfully sent **$${formatMoney(amount)}** to **${discordUser?.tag || giveUser.username}**.`)
        .setTimestamp(new Date())
        .setFooter(config.footer);

    takeUser.balance -= amount;
    giveUser.balance += amount;

    takeUser.save();
    giveUser.save();

    log(`blue`, `${message.author.tag} gave $${amount} to ${discordUser?.tag || giveUser.username}`);

    message.channel.send(sEmbed);
};

export {
    cmd,
    run
};

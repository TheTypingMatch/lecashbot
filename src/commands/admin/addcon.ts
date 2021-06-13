import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../../types/discord';

import config from '../../../config/config';
import log from '../../utils/log';

import User from '../../models/user.model';

import getQuery from '../../utils/getQuery';
import { formatMoney } from '../../utils/text';

const cmd: CommandConfig = {
    desc: `Add a contributor.`,
    category: `admin`,
    usage: `<user> <contribution> [amount]`
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const m = `${message.author} »`;
    const query = getQuery(message, args);

    const user = await User.findOne(query);
    const perpetrator = await User.findOne({ discordiD: message.author.id });

    const contribution = args[1];

    if (!user) return message.channel.send(`${m} That user does not have an account!`);
    if (user.badges[contribution] && contribution !== `donor`) return message.channel.send(`${m} That user already has that contribution!`);

    if (contribution === `donor`) {
        if (!args[2]) return message.channel.send(`${m} Donation amount not specified!`);
        if (isNaN(parseInt(args[2]))) return message.channel.send(`${m} Invalid donation amount!`);
    }

    if (contribution === `owner`) return message.channel.send(`${m} This can only be assigned through the database!`);
    if (!perpetrator.badges.owner && (contribution === `dev` || contribution === `admin`)) return message.channel.send(`${m} This role can only be assigned by an owner!`);

    user[contribution] = true;
    if (user[contribution] === `donor`) user.donations = parseInt(args[2]);

    const contributorEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setAuthor(`Contributor Added`, message.author.avatarURL())
        .setDescription(`Succesfully added rank \`${contribution}\` to \`${user.username}\`. ${contribution === `donor` ? `\nDonation Amount: **$${formatMoney(parseInt(args[1]))}` : ``}`)
        .setTimestamp(new Date())
        .setFooter(config.footer);

    log(`blue`, `${message.author.tag} added contribution ${contribution} to user ${user.username}.`);
    message.channel.send(contributorEmbed);
};

export {
    cmd,
    run
};

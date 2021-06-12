import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../../types/discord';

import config from '../../../config/config';
// import axios from 'axios';

import User from '../../models/user.model';
import log from '../../utils/log';

const cmd: CommandConfig = {
    desc: `Register an account.`,
    category: `register`,
    usage: `<username>`,
    aliases: [`signup`, `createaccount`]
};

// const checkAccount = async (username: string) => await axios.get(`https://www.nitrotype.com/racer/${username}`).then((res) => res.data.includes(`RACER_INFO`));

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const m = `${message.author} »`;
    const username = args.shift().toLowerCase();

    const userExists = await User.findOne({ discordID: message.author.id });
    if (userExists) return message.channel.send(`${m} You already have an account!`);

    const accountIsInUse = await User.findOne({ username });
    if (accountIsInUse) return message.channel.send(`${m} That account already exists!`);

    // const accountExists = await checkAccount(username);
    // if (!accountExists) return message.channel.send(`${m} That account does not exist!\nMake sure that you are entering your **username** and not your display name!`);

    const user = new User({
        username,
        discordID: message.author.id,
        creationDate: new Date().toString()
    });

    user.save(err => {
        if (err) {
            log(`red`, err);
            return message.channel.send(`${m} Error creating account. Contact a LeCashBot dev!`);
        }

        const sEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
            .setColor(config.colors.green)
            .setAuthor(`Account Created`, message.author.avatarURL())
            .setDescription(`Success! Do \`${config.prefix}help\` to view commands!`)
            .setTimestamp(new Date())
            .setFooter(config.footer);
        message.channel.send(sEmbed);
    });
};

export {
    cmd,
    run
};

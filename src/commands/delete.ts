import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

import config from '../../config/config';

import User from '../models/user.model';
import randomString from '../utils/randomString';

const cmd: CommandConfig = {
    desc: `Delete your account`
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const m = `${message.author} »`;

    const user = await User.findOne({ discordID: message.author.id });
    if (!user) return message.channel.send(`${m} You do not have an account!`);

    const verificationCode = randomString(4);

    message.channel.send(`${m} Are you sure you want to delete your account?\nType \`${verificationCode}\` to confirm doing so.`);

    message.channel.awaitMessages(m => m.author.id === message.author.id, {
        max: 1,
        time: 1e4,
        errors: [`time`]
    }).then(msgs => {
        if (msgs.first().content !== verificationCode) return message.channel.send(`${m} Invalid verification code. Aborting account deletion.`);

        const sEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
            .setColor(config.colors.danger)
            .setAuthor(`Deleted account`)
            .setDescription(`Your account has succesfully been deleted.\nWe are sorry to see you go.`)
            .setTimestamp(new Date())
            .setFooter(config.footer);

        message.channel.send(sEmbed);
    });
};

export {
    cmd,
    run
};

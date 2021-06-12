import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../../types/discord';

import config from '../../../config/config';
import User from '../../models/user.model';

import randomInt from '../../utils/randomInt';
import log from '../../utils/log';

const cmd: CommandConfig = {
    desc: `Change your linked NT account.`,
    category: `register`,
    usage: `<username>`
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const m = `${message.author} »`;

    const user = await User.findOne({ discordID: message.author.id });
    if (!user) return message.channel.send(`${m} You do not have an account!`);

    const verificationCode = randomInt(0, 9999).toString();
    message.channel.send(`${m} Are you sure you want to change your linked NT account?\nType \`${verificationCode}\` to confirm doing so.`);

    message.channel.awaitMessages(m => m.author.id === message.author.id, {
        max: 1,
        time: 1e4,
        errors: [`time`]
    }).then(msgs => {
        if (msgs.first().content !== verificationCode) return message.channel.send(`${m} Invalid verification code. Aborting account deletion.`);

        user.delete(err => {
            if (err) {
                log(`red`, err);
                return message.channel.send(`${m} There was an error changing your linked NT account.\nPlease notify your local LeCashBot developer.`);
            }
        });

        const sEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
            .setColor(config.colors.orange)
            .setAuthor(`Renamed Account`, message.author.avatarURL())
            .setDescription(`Your NT account has been succesfully changed.\nWe are sorry to see you go.`)
            .setTimestamp(new Date())
            .setFooter(config.footer);

        message.channel.send(sEmbed);
    });
};

export {
    cmd,
    run
};

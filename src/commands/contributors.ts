import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

import config from '../../config/config';
import User from '../models/user.model';

const cmd: CommandConfig = {
    desc: `View all contributors.`,
    aliases: [`contribs`]
};

const addField = (userData: any[]) => {
    if (!userData || userData.length === 0) return `No users found.`;

    const field = `${userData.map(user => `<@${user.id}>`)}`;
    return (userData.length > 5)
        ? field.replace(/,/g, ` `)
        : field.replace(/,/g, `\n`);
};

const getContributors = async (type: string) => {
    const contributors = await User.find({ banned: false, [`badges/${type}`]: true });
    return contributors.map((contributor) => ({
        id: contributor.discordID,
        [type]: true
    }));
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const admins = await getContributors(`admin`);
    const devs = await getContributors(`dev`);
    const testers = await getContributors(`tester`);

    const sEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setAuthor(`Contributors`, message.author.avatarURL())
        .addField(`Developers`, addField(devs))
        .addField(`Admins`, addField(admins))
        .addField(`Testers`, addField(testers))
        .addField(`Donors`, `Run \`${config.prefix}donate\` to view cash donors.`)
        .setTimestamp(new Date())
        .setFooter(config.footer);

    message.channel.send(sEmbed);
};

export {
    cmd,
    run
};

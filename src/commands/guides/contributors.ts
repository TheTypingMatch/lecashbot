import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../../types/discord';

import config from '../../../config/config';
import User from '../../models/user.model';

const cmd: CommandConfig = {
    desc: `View all contributors.`,
    category: `guides`,
    aliases: [`contribs`]
};

const addField = async (userData: any[], client: Client) => {
    if (!userData || userData.length === 0) return `No users found.`;

    let field = ``;
    for (const userID of userData) {
        const discUser = await client.users.fetch(userID);
        field += `${discUser?.username || ``} ${userData.length > 5 ? ` ` : `\n`}`;
    }

    return field;
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
        .addField(`Developers`, await addField(devs, client))
        .addField(`Admins`, await addField(admins, client))
        .addField(`Testers`, await addField(testers, client))
        .addField(`Donors`, `Run \`${config.prefix}donate\` to view cash donors.`)
        .setTimestamp(new Date())
        .setFooter(config.footer);

    message.channel.send(sEmbed);
};

export {
    cmd,
    run
};

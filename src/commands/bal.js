import { User } from '../models/user.model';
import { MessageEmbed } from 'discord.js';
import { colors, version } from '../config/config';
import { currency } from '../utils/format';

export default async ({ author, channel }, client, args) => {
    const err = `This user does not have an account!`;
    const userId = args[0] ? args[0].replace(/<|@|!|>/g, ``) : author.id;

    const isNotId = (isNaN(parseInt(userId)));
    const userData = (isNotId) ? { name: args.join(` `).trim() } : { discordId: userId };
    const user = await User.findOne(userData);
    const result = user ? `**${user.name}**'s balance is **$${currency(user.balance)}**.` : err;

    const userAvatar = client.users.cache.get((isNotId) ? user.discordId : userId);

    const balanceEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor(`Balance`, userAvatar ? userAvatar.avatarURL() : author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(result);

    return channel.send(balanceEmbed);
};

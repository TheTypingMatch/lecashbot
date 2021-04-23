import { User } from '../../models/user.model';
import { MessageEmbed } from 'discord.js';
import { colors, version } from '../../config/config';

export default async ({ author, channel }, client, args) => {
    const err = 'This user does not have an account!';
    const userId = args[0] ? args[0].replace(/<|@|!|>/g, '') : author.id;
    const id = { discordId: userId };
    const user = await User.findOne(id);
    let result = (user && !user.dev) ? `${user.name} has been unbanned.` : err;

    client.logger.ready(`${user.name} has been unbanned. (Moderator: ${author.id})`);

    if (!user.dev) {
        User.update(id, { banned: false });
    } else result = "You can't unban a developer/admin!";

    const unbanEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor('Unban', author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(result);

    return channel.send(unbanEmbed);
};

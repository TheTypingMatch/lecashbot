import { User } from '../models/user.model';
import { MessageEmbed } from 'discord.js';
import { colors, version } from '../config/config';

const deleteEmbed = new MessageEmbed()
    .setColor(colors.green)
    .setTimestamp(new Date())
    .setFooter(`LeCashBot v${version}`)
    .setDescription(`Your data has been deleted.`);

const deleteData = async (client, id, msg) => {
    await User.deleteOne({ discordId: id });
    client.logger.ready(`${id} deleted their data.`);

    return msg.channel.send(deleteEmbed);
};

export default async (msg, client, args) => {
    const error = `You must type your Discord name: \`$delete DISCORD_ID\``;

    const userId: string = args[0];
    const user: any = await User.findOne({ discordId: msg.author.id });

    deleteEmbed.setAuthor(`Delete`, msg.author.avatarURL());

    return (userId && userId === user.discordId)
        ? deleteData(client, msg.author.id, msg)
        : msg.reply(error);
};

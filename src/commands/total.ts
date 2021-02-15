import { MessageEmbed } from "discord.js";
import { colors, version } from "../config/config";
import { currency } from "../utils/format";

export default async (msg, client, args) => {
    const totalEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor("Total", msg.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(`All users have a total of $**${currency(client.total)}**.`);

    return msg.channel.send(totalEmbed);
};

import { MessageEmbed } from "discord.js";
import { colors, version } from "../config/config";

export default async (msg, client, args) => {
    const reportEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor("Report", msg.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription("Report a bug [here](https://github.com/TheTypingMatch/le-cash-bot/issues).");

    return msg.channel.send(reportEmbed);
};

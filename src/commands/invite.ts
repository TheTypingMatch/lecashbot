import { MessageEmbed } from "discord.js";
import { colors, version } from "../config/config";

export default async (msg, client, args) => {
    const inviteEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor("Invite", msg.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription("Invite LeCashBot [**here**](https://lesirh.github.io/lecashbot/).");

    return msg.channel.send(inviteEmbed);
};

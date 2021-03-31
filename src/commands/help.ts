import { helpInfo } from '../config/embeds';
import { MessageEmbed } from 'discord.js';
import { colors, version } from '../config/config';
import { addCommandField } from '../utils/field';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default (msg, client, args) => {
    const helpEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor('Help', msg.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .addField('Categories', helpInfo.descInfo);

    if (args[0]) {
        const category: string = args[0].toLowerCase();
        if (helpInfo[category] && category !== 'desc' && category !== 'descInfo') {
            const categoryInfo: string = helpInfo[category];
            helpEmbed.addField(
                capitalize(category),
                addCommandField(categoryInfo)
            );
        }
    }

    helpEmbed.setDescription(helpInfo.desc);
    return msg.channel.send(helpEmbed);
};

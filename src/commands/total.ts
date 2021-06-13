import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

import config from '../../config/config';

import Leaderboard from '../models/leaderboard.model';
import { formatMoney } from '../utils/text';

const cmd: CommandConfig = {
    desc: `View the global cash pool.`,
    category: `economy`
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const lb = await Leaderboard.findOne();

    const totalEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setAuthor(`Total Cash`, message.author.avatarURL())
        .setDescription(`All users have a total of **$${formatMoney(lb.totalBalance)}**.`)
        .setTimestamp(new Date())
        .setFooter(config.footer);

    message.channel.send(totalEmbed);
};

export {
    cmd,
    run
};

import * as Discord from 'discord.js';
import { Client, CommandConfig } from '../types/discord';

import config from '../../config/config';
import User from '../models/user.model';

import getQuery from '../utils/getQuery';
import { capitalize, formatMoney } from '../utils/text';

const cmd: CommandConfig = {
    desc: `View yours or another user's profile.`,
    category: `economy`,
    usage: `[user]`,
    aliases: [`p`]
};

const run = async (client: Client, message: Discord.Message, args: string[]) => {
    const m = `${message.author} »`;

    const query = getQuery(message, args);

    const user = await User.findOne(query);
    if (!user) return message.channel.send(`${m} That user does not have an account!`);

    const discordUser = await client.users.fetch(user.discordID);

    let badgeStr = ``;
    const badges = {
        owner: `[⚔️](${message.url} "Owner")`,
        dev: `[🛠️](${message.url} "Developer")`,
        admin: `[⚒️](${message.url} "Administrator")`,
        tester: `[🧪](${message.url} "Tester")`,
        donor: `[💰](${message.url} "Donor")`
    };

    for (const badge of Object.keys(badges)) if (user.badges[badge]) badgeStr += `${badges[badge]} `;
    if (badgeStr !== ``) badgeStr += `**|**`;

    const profileData = {
        general: {
            balance: `$${formatMoney(user.balance)}`,
            donations: `$${formatMoney(user.donations)}`
        },
        streaks: {
            coinflip: formatMoney(user.streaks.coinflip),
            daily: formatMoney(user.streaks.daily)
        },
        highscores: {
            [`coinflip streak`]: formatMoney(user.highscores.coinflip),
            [`daily streak`]: formatMoney(user.highscores.daily),
            [`highest bet`]: `$${formatMoney(user.highscores.bet)}`
        }
    };

    const sEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(config.colors.green)
        .setAuthor(`${discordUser?.username || user.username}'s Profile`, discordUser?.avatarURL() || client.user.avatarURL())
        .setDescription(`${badgeStr} [**Nitro Type**](https://www.nitrotype.com/racer/${user.username})`)

        .addField(`General`, Object.entries(profileData.general).map(entry => `${capitalize(entry[0])}: **${entry[1]}**`), true)
        .addField(`Streaks`, Object.entries(profileData.streaks).map(entry => `${capitalize(entry[0])}: **${entry[1]}**`), true)
        .addField(`Highscores`, Object.entries(profileData.highscores).map(entry => `${capitalize(entry[0])}: **${entry[1]}**`), true)

        .setTimestamp(new Date())
        .setFooter(config.footer);
    message.channel.send(sEmbed);
};

export {
    cmd,
    run
};

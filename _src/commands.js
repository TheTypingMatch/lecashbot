import { User } from './models/user.model';
import { colors, version } from './config/config';
import { MessageEmbed } from 'discord.js';
import fs from 'fs';
import path from 'path';

const run = async (cmd, msg, client, args) => {
    const cooldownEmbed = new MessageEmbed()
        .setColor(colors.yellow)
        .setAuthor('Cooldown')
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription('A little too quick there!');

    const userId = { discordId: msg.author.id };
    const user = await User.findOne({ discordId: msg.author.id });
    const generalPath = path.resolve(`./src/commands/${cmd}.js`);
    const adminPath = path.resolve(`./src/commands/admin/${cmd}.js`);
    const hasAdminPerms = (fs.existsSync(adminPath) && user?.admin);

    if (user && fs.existsSync(generalPath)) {
        if (user.cmdCooldown && new Date().getTime() - user.cmdCooldown < 3000) {
            return msg.channel.send(cooldownEmbed);
        } else {
            User.updateOne(userId, { cmdCooldown: new Date() }, err => {
                if (err) {
                    client.logger.log('Error updating user cooldown.', 'error');
                }
            });
        }
    }

    if (hasAdminPerms) {
        msg.channel.startTyping();
        const adminCMD = await import(`./commands/admin/${cmd}`);
        adminCMD.default(msg, client, args);
    } else if (fs.existsSync(generalPath)) {
        msg.channel.startTyping();
        const generalCMD = await import(`./commands/${cmd}`);
        generalCMD.default(msg, client, args);
    }

    return msg.channel.stopTyping();
};

export { run };

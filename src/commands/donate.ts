import { User } from '../models/user.model';
import { MessageEmbed } from 'discord.js';
import { colors, version } from '../config/config';
import { donate } from '../config/embeds';
import { currency } from '../utils/format';

const { donateLink } = donate;

const getDonors = async () => {
    const donors = await User.find({ donor: true });
    return donors.map((donor: { name: any; donations: any }) => ({
        name: donor.name,
        amount: donor.donations
    }));
};

const addField = (userData: any[]) => {
    userData.sort((a, b) => {
        const aAmount: number = a.amount;
        const bAmount: number = b.amount;
        return (aAmount > bAmount) ? 1 : ((bAmount > aAmount) ? -1 : 0);
    }).reverse();

    return `${userData.map(user => `**${user.name}** - \`$${currency(user.amount || 0)}\`\n`)}`.replace(/\n,/g, `\n`);
};

export default async (msg, client, args) => {
    const donors: any = await getDonors();

    const donateEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor(`Donate`, msg.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(donateLink)
        .addField(`Donors`, addField(donors));

    return msg.channel.send(donateEmbed);
};

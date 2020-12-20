import { User } from '../models/user.model';
import { Lottery } from '../models/lottery.model';
import { MessageEmbed } from 'discord.js';
import { colors, version } from '../config/config';
import { currency } from '../utils/format';

const lotteryEmbed = new MessageEmbed()
    .setColor(colors.green)
    .setFooter(`LeCashBot v${version}`)
    

// capitalize first letter
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

// calculate time between now and end date
const timeLeft = endDate => {
    return 0;
}

// format time to dd:hh:mm:ss
const formatTime = date => {
    return '';
}

export default async (msg, client, args) => {
    lotteryEmbed
        .setAuthor('Lottery!', userAvatar ? userAvatar.avatarURL() : author.avatarURL())
        .setTimestamp(new Date());
        
    let description = '';
    const lotteryTypes = ['daily', 'weekly', 'monthly'];
    for (type of lotteryTypes) {
        const lottery = await Lottery.findOne({ type });
        const timeLeft: string = formatTime(timeLeft(lottery.endDate));
        
        lotteryEmbed.addField(`**${capitalize(type)}**`, `
            Ends in: \`${timeLeft}\`
            Entries: **${lottery.entries}**
            Prize Pool: $**${currency(lottery.entryFree * lottery.entries)}**
        `);
    }

    lotteryEmbed.setDescription(`
        **How to Enter**
        \`$lottery <type> enter\` (e.g. \`$lottery daily enter\`)
    `);

    return channel.send(lotteryEmbed);
};

/*

    $lottery
    - prize pool
    - entry cost
    - start/end date
    - steps to enter:


    **Daily**
    Ends in: 00h 00m
    Entries: 12
    Prize Pool: $12,000

    **Weekly**
    Ends in: 00d 00h 00m
    Entries: 50
    Prize Pool: $250,000

    **Monthly**
    Ends in: 00d 00h 00m
    Entries: 100
    Prize Pool: $2,500,000

    **How to Enter**
    `$lottery <type> enter` (e.g. `$lottery daily enter`)


    when the lottery ends, dm each user the winner and the prize

*/

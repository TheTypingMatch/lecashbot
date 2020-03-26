const Discord = require('discord.js')
const config = require('../../config/config')
const embeds = require('../../config/embeds').donate

const addDonateField = info => {
    const infoDescription = Object.entries(info).map(desc => `**${desc[0]}** - ${desc[1]}`)
    return `${infoDescription}`.replace(/,/g, '\n')
}

module.exports = (msg, client, args) => {

    let donateEmbed = new Discord.RichEmbed()
        .setColor(config.colors.green)
        .setAuthor('Donate', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${config.version}`)
        .setDescription(embeds.donateLink)
        .addField('Donors', addDonateField(embeds.donors))

    return msg.channel.send(donateEmbed)

}

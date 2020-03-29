const { RichEmbed } = require('discord.js')
const { colors, version } = require('../../config/config')
const { donateLink, donors } = require('../../config/embeds').donate

const addDonateField = info => {
    const infoDescription = Object.entries(info).map(desc => `**${desc[0]}** - ${desc[1]}`)
    return `${infoDescription}`.replace(/,/g, '\n')
}

module.exports = (msg, client, args) => {

    let donateEmbed = new RichEmbed()
        .setColor(colors.green)
        .setAuthor('Donate', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(donateLink)
        .addField('Donors', addDonateField(donors))

    return msg.channel.send(donateEmbed)

}

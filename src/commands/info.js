const Discord = require('discord.js')
const config = require('../../config/config')
const embeds = require('../../config/embeds').info

const addInfoField = info => {
    const infoDescription = Object.entries(info).map(desc => `${desc[1]}`)
    return `${infoDescription}`.replace(/,/g, '\n')
}

module.exports = (msg, client, args) => {

    let helpEmbed = new Discord.RichEmbed()
        .setColor(config.colors.green)
        .setAuthor('Info', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${config.version}`)
        .addField('General', addInfoField(embeds.general))
        .addField('Contributors', addInfoField(embeds.contributors))
        .addField('Contribute', addInfoField(embeds.contribute))
        .addField('Donors', addInfoField(embeds.donors))

    return msg.channel.send(helpEmbed)

}

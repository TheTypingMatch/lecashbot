const { RichEmbed } = require('discord.js')
const { colors, version } = require('../../config/config')
const { general, contributors, contribute, donors } = require('../../config/embeds').info

const addInfoField = info => {
    const infoDescription = Object.entries(info).map(desc => `${desc[1]}`)
    return `${infoDescription}`.replace(/,/g, '\n')
}

module.exports = (msg, client, args) => {

    let helpEmbed = new RichEmbed()
        .setColor(colors.green)
        .setAuthor('Info', msg.author.avatarURL)
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .addField('General', addInfoField(general))
        .addField('Contributors', addInfoField(contributors))
        .addField('Contribute', addInfoField(contribute))
        .addField('Donors', addInfoField(donors))

    return msg.channel.send(helpEmbed)

}

const { helpInfo } = require('../config/embeds')
const { MessageEmbed } = require('discord.js')
const { colors, version } = require('../config/config')
const { addCommandField } = require('../utils/field')

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

module.exports = (msg, client, args) => {
    const helpEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor('Help', msg.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .addField('Categories', helpInfo.descInfo)

    if (args[0]) {
        const category = args[0].toLowerCase()
        if (helpInfo[category] && category !== 'desc' && category !== 'descInfo') {
            const categoryInfo = helpInfo[category]
            helpEmbed.addField(
                capitalize(category),
                addCommandField(categoryInfo)
            )
        }
    }

    helpEmbed.setDescription(helpInfo.desc)
    return msg.channel.send(helpEmbed)
}

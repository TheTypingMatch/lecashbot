import { MessageEmbed } from 'discord.js'
import { colors, version } from '../config/config'
import { info } from '../config/embeds'
import { addDescriptionField } from '../utils/field'

export default (msg, client, args) => {
    const { general, contribute, donors, invite } = info
    const helpEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor('Info', msg.author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .addField('General', addDescriptionField(general))
        .addField('Contributors', 'See `$contributors` to view all contributors.')
        .addField('Contribute', addDescriptionField(contribute))
        .addField('Donors', addDescriptionField(donors))
        .addField('Invite', addDescriptionField(invite))

    return msg.channel.send(helpEmbed)
}

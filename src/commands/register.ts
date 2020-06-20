const fetch = require('node-fetch')
import { User } from '../models/user.model'

const urlExists = async (url: string) => {
    return await fetch(url)
        .then((res: { text: () => any }) => res.text())
        .then((res: string | string[]) => res.includes('RACER_INFO'))
}

const registerUser = (msg, ntLink: string) => {
    const user = new User({
        date: new Date(),
        name: msg.author.username,
        nitroTypeLink: ntLink,
        discordId: msg.author.id,
        discordTag: msg.author.tag
    })
    user.save((err: any) => {
        if (err) {
            return msg.reply('Error creating account. Contact a LeCashBot dev!')
        } else return msg.reply('Success! See `$help` for information on commands')
    })
}

export default async (msg, client, args) => {
    if (!args[0]) {
        return msg.reply('Use your NitroType **username** (NOT display name): Use `$register USERNAME`')
    }

    // Check if the user already has an account
    const userExists = await User.findOne({
        discordId: msg.author.id
    })

    if (userExists) return msg.reply('You already have an account!')

    // Check if someone is already registered with this NitroType link
    const linkExists: any = await User.findOne({ nitroTypeLink: args[0] })
    if (linkExists) {
        return msg.reply('Someone is already registered with this account!')
    }

    const link: string = (args[0].includes('nitrotype.com/racer/'))
        ? args[0]
        : `https://www.nitrotype.com/racer/${args[0]}`

    const ntLinkExists: boolean = await urlExists(link)
    return (ntLinkExists)
        ? registerUser(msg, link)
        : msg.reply('Invalid NitroType profile link!')
}

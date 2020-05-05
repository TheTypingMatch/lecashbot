const replaceCommas = str => `${str}`.replace(/,/g, '\n')

module.exports = {
    addTitleField: info => {
        const infoDescription = Object.entries(info).map(desc => `**${desc[0]}** - ${desc[1]}`)
        return replaceCommas(infoDescription)
    },
    addDescriptionField: info => {
        const infoDescription = Object.entries(info).map(desc => `${desc[1]}`)
        return replaceCommas(infoDescription)
    },
    addCommandField: info => {
        const infoDescription = Object.entries(info).map(desc => `\`$${desc[0]}\` ${desc[1]}`)
        return replaceCommas(infoDescription)
    }
}

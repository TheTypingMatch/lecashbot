const replaceCommas = str => `${str}`.replace(/,/g, '\n')

const addTitleField = info => {
    const infoDescription = Object.entries(info).map(desc => `**${desc[0]}** - ${desc[1]}`)
    return replaceCommas(infoDescription)
}

const addDescriptionField = info => {
    const infoDescription = Object.entries(info).map(desc => `${desc[1]}`)
    return replaceCommas(infoDescription)
}

const addCommandField = info => {
    const infoDescription = Object.entries(info).map(desc => `\`$${desc[0]}\` ${desc[1]}`)
    return replaceCommas(infoDescription)
}

export {
    addTitleField,
    addDescriptionField,
    addCommandField
}

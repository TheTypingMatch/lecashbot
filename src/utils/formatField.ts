const replaceCommas = (str: string[]) => `${str}`.replace(/,/g, `\n`);

const addTitleField = (info: any) => {
    const infoDescription = Object.entries(info).map(desc => `**${desc[0]}** - ${desc[1]}`);
    return replaceCommas(infoDescription);
};

const addDescriptionField = (info: any) => {
    const infoDescription = Object.entries(info).map(desc => `${desc[1]}`);
    return replaceCommas(infoDescription);
};

const addCommandField = (info: any) => {
    const infoDescription = Object.entries(info).map(desc => `\`$${desc[0]}\` ${desc[1]}`);
    return replaceCommas(infoDescription);
};

export {
    addTitleField,
    addDescriptionField,
    addCommandField
};

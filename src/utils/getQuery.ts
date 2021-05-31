import * as Discord from 'discord.js';

const getQuery = (message: Discord.Message, args: string[]) => {
    let query = {};
    let queryParam = message.mentions.members.first()?.id;

    if (queryParam) query = { discordID: queryParam };
    else {
        queryParam = args[0];
        if (queryParam) {
            const isID = parseInt(queryParam);
            query = isID ? { discordID: queryParam } : { username: queryParam.toLowerCase() };
        } else query = { discordID: message.author.id };
    }

    return query;
};

export default getQuery;

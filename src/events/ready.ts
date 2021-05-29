import { Client } from '../types/discord';
import log from '../utils/log';

const callback = (client: Client) => {
    log(`green`, `Client has started, with ${client.users.cache.size} users in ${client.guilds.cache.size} guilds.`);
};

export {
    callback
};

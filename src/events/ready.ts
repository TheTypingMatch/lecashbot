import { Client } from '../types/discord';
import log from '../utils/log';

const callback = (client: Client) => {
    log(`green`, `Client has started, with ${client.users.cache.size} user(s) in ${client.guilds.cache.size} guild(s).`);
};

export {
    callback
};

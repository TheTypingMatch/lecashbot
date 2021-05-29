import { Client } from '../types/discord';
import log from '../utils/log';
import refreshActivity from '../utils/refreshActivity';

const callback = (client: Client) => {
    log(`green`, `Client has started, with ${client.users.cache.size} user(s) in ${client.guilds.cache.size} guild(s).`);

    // Update guild count every 10 minutes.
    setInterval(refreshActivity, 36e6);
};

export default callback;

import { Client } from '../types/discord';
import refreshActivity from '../utils/refreshActivity';

import log from '../utils/log';
import { logHeader } from '../utils/logExtra';

export default async (client: Client) => {
    log(`green`, `Client has started, with ${client.users.cache.size} user(s) in ${client.guilds.cache.size} guild(s).`);

    logHeader(async () => {
        // Update guild count every 10 minutes.
        setInterval(() => refreshActivity(client), 36e6);

        // Then, set client activity for the first time.
        refreshActivity(client);
    });
};

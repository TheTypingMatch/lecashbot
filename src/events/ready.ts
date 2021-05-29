import { Client } from '../types/discord';

import log from '../utils/log';
import { logHeader } from '../utils/logExtra';

import refreshActivity from '../utils/refreshActivity';
import resetDailyStreak from '../utils/resetDailyStreak';
import updateLeaderboards from '../utils/updateLeaderboards';

export default async (client: Client) => {
    log(`green`, `Client has started, with ${client.users.cache.size} user(s) in ${client.guilds.cache.size} guild(s).`);

    logHeader(async () => {
        // Run utility scripts for the first time.
        await refreshActivity(client);

        await resetDailyStreak();
        await updateLeaderboards(client);

        setInterval(() => refreshActivity(client), 6e5); // Update guild count every 10 minutes.
        setInterval(() => resetDailyStreak, 864e5); // Reset daily streak every 24 hours.
    });
};

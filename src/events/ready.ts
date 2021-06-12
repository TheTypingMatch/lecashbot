import { Client } from '../types/discord';
import config from '../../config/config';

import log from '../utils/log';
import { logHeader } from '../utils/logExtra';

import refreshActivity from '../modules/refreshActivity';
import resetDailyStreak from '../modules/resetDailyStreak';
import updateLeaderboards from '../modules/updateLeaderboards';

export default async (client: Client) => {
    log(`green`, `Client has started, with ${client.users.cache.size} user(s) in ${client.guilds.cache.size} guild(s).`);

    logHeader(() => {
        refreshActivity(client, () => {
            resetDailyStreak(() => {
                updateLeaderboards(client, () => {
                    setInterval(() => refreshActivity(client), config.cooldowns.utils.refreshActivity);
                    setInterval(() => resetDailyStreak, config.cooldowns.utils.dailyReset);
                    setInterval(() => updateLeaderboards(client), config.cooldowns.utils.lbUpdate);
                });
            });
        });
    });
};

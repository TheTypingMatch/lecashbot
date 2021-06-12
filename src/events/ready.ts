import { Client } from '../types/discord';
import config from '../../config/config';

import log from '../utils/log';
import { logHeader } from '../utils/logExtra';

import refreshActivity from '../modules/refreshActivity';
import resetDailyStreak from '../modules/resetDailyStreak';
import updateLeaderboards from '../modules/updateLeaderboards';
import updateLottery from '../modules/updateLottery';

export default async (client: Client) => {
    log(`green`, `Client has started, with ${client.users.cache.size} user(s) in ${client.guilds.cache.size} guild(s).`);

    logHeader();

    await refreshActivity(client);
    await resetDailyStreak();
    await updateLeaderboards(client);

    setInterval(async () => (await refreshActivity(client)), config.cooldowns.utils.refreshActivity);
    setInterval(async () => (await resetDailyStreak()), config.cooldowns.utils.dailyReset);
    setInterval(async () => (await updateLeaderboards(client)), config.cooldowns.utils.updateLeaderboards);
    setInterval(async () => (await updateLottery(client)), config.cooldowns.utils.updateLottery);
};

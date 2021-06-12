import { Client } from '../types/discord';
import log from '../utils/log';

const refreshActivity = async (client: Client) => {
    log(`cyan`, `Updating status...`);

    await client.user.setPresence({
        activity: {
            type: `WATCHING`,
            name: `${client.guilds.cache.size} servers`
        },

        status: `online`
    });

    log(`green`, `Status updated.`);
};

export default refreshActivity;

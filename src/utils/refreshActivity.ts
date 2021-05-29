import { Client } from '../types/discord';
import log from '../utils/log';

const refreshActivity = (client: Client) => {
    log(`cyan`, `Updating presence...`);
    client.user.setPresence({
        activity: {
            type: `WATCHING`,
            name: `${client.guilds.cache.size} servers`
        },

        status: `online`
    });
};

export default refreshActivity;

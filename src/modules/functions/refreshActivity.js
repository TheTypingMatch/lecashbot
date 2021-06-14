export default (client) => {
    client.logger.log(`Updating presence...`, `log`);
    client.user.setPresence({
        activity: {
            type: `WATCHING`,
            name: `${client.guilds.cache.size} servers.`
        },
        status: `online`
    });
    client.logger.log(`Done updating presence.`, `ready`);
};

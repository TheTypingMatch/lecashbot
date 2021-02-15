import { msgCooldown } from "../config/cooldowns";
import { functions } from "../modules/functions";

module.exports = async client => {
    client.logger.ready("Client is ready.");

    await functions(client);

    const {
        user,
        users,
        logger,
        guilds,
        msgCooldowns,
        resetDailyStreak,
        updateLeaderboards,
        refreshActivity,
        updateTotal,
        updateLottery
    } = client;

    updateLottery(client);
    updateTotal(client);
    resetDailyStreak(client);
    updateLeaderboards(client);
    refreshActivity(client);
    setInterval(() => msgCooldowns.splice(0, msgCooldowns.length), msgCooldown);
    logger.ready(`${user.username} is ready: ${users.cache.size} users, ${guilds.cache.size} servers.`);
};

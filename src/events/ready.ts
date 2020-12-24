import { msgCooldown } from '../config/cooldowns';

module.exports = async client => {
    const {
        resetDailyStreak, users,
        refreshActivity, logger,
        msgCooldowns, guilds, user,
        updateLeaderboards, updateTotal,
        updateLottery
    } = client;
    const readyMsg: string = `${user.username} is ready: ${users.cache.size} users, ${guilds.cache.size} servers.`;

    updateLottery();
    updateTotal();
    resetDailyStreak();
    updateLeaderboards();
    refreshActivity();
    setInterval(() => msgCooldowns.splice(0, msgCooldowns.length), msgCooldown);
    logger.ready(readyMsg);
};

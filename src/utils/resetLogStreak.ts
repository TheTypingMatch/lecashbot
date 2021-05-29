import User from '../models/user.model';

import log from './log';

const resetDailyStreak = async () => {
    log(`cyan`, `Updating daily streaks...`);

    const activeUsers = await User.find({ banned: false });
    if (!activeUsers) return log(`yellow`, `No active users found. Skipping...`);

    for (const user of activeUsers) {
        if (new Date().valueOf() - new Date(user.cooldowns.daily).valueOf()) {
            log(`blue`, `Daily streak reset for user ${user.username} [${user.discordID}]`);

            user.streaks.daily = 0;
            user.save();
        }
    }
};

export default resetDailyStreak;

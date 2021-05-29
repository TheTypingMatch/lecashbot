import User from '../models/user.model';

import log from './log';

const resetDailyStreak = async (callback?: any) => {
    log(`cyan`, `Updating daily streaks...`);

    const users = await User.find({ banned: false });
    if (!users || users.length === 0) {
        log(`yellow`, `No active users found. Skipping...`);

        if (callback !== undefined) callback();
        return;
    }

    for (const user of users) {
        if (new Date().valueOf() - new Date(user.cooldowns.daily).valueOf()) {
            log(`blue`, `Daily streak reset for user ${user.username} [${user.discordID}]`);

            user.streaks.daily = 0;
            user.save();
        }
    }

    log(`green`, `Daily streaks updated.`);
    if (callback !== undefined) return callback();
};

export default resetDailyStreak;

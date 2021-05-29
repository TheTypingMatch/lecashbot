import User from '../models/user.model';

import log from './log';

const resetDailyStreak = async (callback?: void) => {
    log(`cyan`, `Updating daily streaks...`);

    const users = await User.find({ banned: false });
    if (!users) return log(`yellow`, `No active users found. Skipping...`);

    for (const user of users) {
        if (new Date().valueOf() - new Date(user.cooldowns.daily).valueOf()) {
            log(`blue`, `Daily streak reset for user ${user.username} [${user.discordID}]`);

            user.streaks.daily = 0;
            user.save();
        }
    }
};

export default resetDailyStreak;

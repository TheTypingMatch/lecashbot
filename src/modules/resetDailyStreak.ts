import User from '../models/user.model';

import log from '../utils/log';

const resetDailyStreak = async () => {
    log(`cyan`, `Updating daily streaks...`);

    const users = await User.find({ banned: false });
    if (!users || users.length === 0) {
        log(`yellow`, `No active users found. Skipping...`);

        return;
    }

    for (const user of users) {
        if (new Date().valueOf() - new Date(user.cooldowns.daily).valueOf()) {
            log(`blue`, `Daily streak reset for user ${user.username} [${user.discordID}].`);

            user.streaks.daily = 0;
            await user.save();
        }
    }

    log(`green`, `Daily streaks updated.`);
};

export default resetDailyStreak;

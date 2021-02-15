import { User } from '../../models/user.model';
import { log } from '../../utils/log';
import { toHours } from '../../utils/date';

export default async (client) => {
    client.logger.log(`Checking dailies...`, `log`);
    const activeUsers: [] = await User.find({ banned: false });
    if (!activeUsers) return;

    activeUsers.forEach((user: any) => {
        const { cooldowns, discordId, dailyStreak, name } = user;
        const notCollected: boolean = (toHours(new Date().getTime() - cooldowns.daily) > 36);
        const userId: { discordId: string } = { discordId: discordId };

        if (notCollected && dailyStreak) {
            User.updateOne(userId, { dailyStreak: 0 }, err => {
                if (err) log(`error`, err, client);
                else client.logger.log(`Daily Streak reset for user ${name}`, `ready`);
            });
        }
    });
    client.logger.log(`Done checking dailies.`, `ready`);
};

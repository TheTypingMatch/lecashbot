import User from '../models/user.model';
import Leaderboard from '../models/leaderboard.model';

import log from './log';

const updateLeaderboards = async (callback?: void) => {
    log(`cyan`, `Updating leaderboards...`);

    // Grab all existing users.
    const users = await User.find({ banned: false });
    if (!users) return log(`yellow`, `No active users found. Skipping...`);

    // Delete all existing leaderboards.
    Leaderboard.deleteMany({});

    const leaderboard = [];

    const lb = new Leaderboard({

    });

    return await lb.save();
};

export default updateLeaderboards;

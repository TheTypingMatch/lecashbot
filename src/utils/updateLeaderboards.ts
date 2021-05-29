import User from '../models/user.model';
import Leaderboard from '../models/leaderboard.model';

import log from './log';

const sortLeaderboard = async () => {
    const lb = [];

    // Grab all existing users.
    const users = await User.find({ banned: false });
    if (!users) return lb;
};

const updateLeaderboards = async () => {
    log(`cyan`, `Updating leaderboards...`);

    // Delete all existing leaderboards.
    Leaderboard.deleteMany({});

    const leaderboard = await sortLeaderboard();
    if (leaderboard.length === 0) return log(`yellow`, `No active users found. Skipping...`);

    const lb = new Leaderboard({
    });

    return await lb.save();
};

export default updateLeaderboards;

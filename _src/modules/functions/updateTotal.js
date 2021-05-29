import { User } from '../../models/user.model';

export default async (client) => {
    client.logger.log('Updating total...');

    const activeUsers = await User.find({ banned: false });
    const userBalances = activeUsers.map(user => user.balance);
    const total = userBalances.reduce((t, bal) => t + bal);

    client.total = total;
};

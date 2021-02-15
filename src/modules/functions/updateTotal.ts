import { User } from '../../models/user.model';

export default async (client) => {
    client.logger.log('Updating total...');

    const activeUsers = await User.find({ banned: false });
    const userBalances = activeUsers.map((user: any) => user.balance);
    const total: number = userBalances.reduce((t: number, bal: number) => t + bal);

    client.total = total;
};

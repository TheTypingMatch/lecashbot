// Functions
import refreshActivity from './functions/refreshActivity';
import resetDailyStreak from './functions/resetDailyStreak';
import updateLottery from './functions/updateLottery';
import updateTotal from './functions/updateTotal';
import updateLeaderboards from './functions/updateLeaderboards';

const oneMinute = 60 * 1000;

const functions = async client => {
    client.refreshActivity = refreshActivity;
    client.resetDailyStreak = resetDailyStreak;
    client.updateLottery = updateLottery;
    client.updateTotal = updateTotal;
    client.updateLeaderboards = updateLeaderboards;

    setInterval(() => client.refreshActivity(client), 15 * oneMinute);
    setInterval(() => client.resetDailyStreak(client), 5 * oneMinute);
    setInterval(() => client.updateLottery(client), 5 * oneMinute);
    setInterval(() => client.updateTotal(client), 30 * oneMinute);
    setInterval(() => client.updateLeaderboards(client), 10 * oneMinute);
};

export { functions };

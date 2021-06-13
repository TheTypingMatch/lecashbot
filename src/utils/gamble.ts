const calcBetChance = (bet: number) => Math.round((695 / bet) + (695 / Math.sqrt(bet)) * 100) / 100 + 3;

const calcCoinflipCost = (coinflipStreak: number) => coinflipStreak !== 0 ? Math.round(100 * (2 ^ (coinflipStreak))) : 0;
const calcCoinflipReward = (coinflipStreak: number) => Math.round(100 * (3 ^ coinflipStreak) + ((coinflipStreak) * 150));
const calcCoinflipStreakBonus = (coinflipStreak: number) => Math.round((100 / (2 ** (coinflipStreak + 1))) * 100) / 100;

export {
    calcBetChance,

    calcCoinflipCost,
    calcCoinflipReward,
    calcCoinflipStreakBonus
};

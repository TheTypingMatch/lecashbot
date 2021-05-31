const cooldowns = {
    commands: {
        bet: 3e3,
        daily: 756e5,
        delete: 864e5,
        suggest: 6e5,
        report: 6e5
    },

    utils: {
        dailyReset: 1296e5,
        refreshActivity: 6e5,
        lbUpdate: 3e5
    }
};

export default cooldowns;

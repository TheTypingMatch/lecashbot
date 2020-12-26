const toMinutes = (date: number) => (date / 1000) / 60;
const toHours = (date: number) => (date / 1000) / 3600;
const toDays = (date: number) => ((date / 1000) / 3600) / 24;

// format time to dd:hh:mm:ss
const formatTime = ms => {
    let seconds: string | number = Math.floor((ms / 1000) % 60);
    let minutes: string | number = Math.floor((ms / (1000 * 60)) % 60);
    let hours: string | number = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days: string | number = Math.floor((ms / (1000 * 60 * 60 * 24)) % 365);

    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;

    return `${days ? `${days}:` : ''}${hours}:${minutes}:${seconds}`;
};

// calculate time between now and end date
const subtractDate = endDate => {
    const now = new Date();
    let timeLeft = endDate.getTime() - now.getTime();

    if (timeLeft < 0) {
        timeLeft = 0;
    }

    return timeLeft;
};

export {
    toMinutes,
    toHours,
    toDays,
    formatTime,
    subtractDate
};

const formatTime = (num: number) => {
    let str = `\``;

    if (Math.abs(num) >= 864e5) str += `${(Math.abs(num) / 864e5).toFixed(2)}\` days`;
    else if (Math.abs(num) >= 36e5) str += `${(Math.abs(num) / 36e5).toFixed(2)}\` hours`;
    else if (Math.abs(num) >= 6e4) str += `${(Math.abs(num) / 6e4).toFixed(2)}\` minutes`;
    else if (Math.abs(num) >= 1e3) str += `${(Math.abs(num) / 1e3).toFixed(2)}\` seconds`;
    else str += `${Math.abs(num)}\` milliseconds`;

    return str;
};

export default formatTime;

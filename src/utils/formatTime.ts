const formatTime = (num: number) =>
    Math.abs(Number(num)) >= 864e5
        ? `${(Math.abs(Number(num)) / 864e5).toFixed(2)} days`
        : Math.abs(Number(num)) >= 36e5
            ? `${(Math.abs(Number(num)) / 36e5).toFixed(2)} hours`
            : Math.abs(Number(num)) >= 6e4
                ? `${(Math.abs(Number(num)) / 6e4).toFixed(2)} minutes`
                : Math.abs(Number(num)) >= 1e3
                    ? `${(Math.abs(num) / 1e3).toFixed(2)}\` seconds`
                    : `\`${Math.abs(num)}\` milliseconds`;

export default formatTime;

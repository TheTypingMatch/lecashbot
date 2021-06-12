const capitalize = (str: string) => {
    const words = str.split(` `);

    const newPhrase: string[] = [];
    for (const word of words) newPhrase.push(word.charAt(0).toUpperCase() + word.slice(1));

    return newPhrase.join(` `);
};

const formatMoney = (num: number) => {
    // First, round the number.
    num = Math.round(num);

    let a = 0;
    let formattedNum = num < 0 ? `-` : ``;

    // Convert negative numbers to positive (as it's already handled above).
    if (num < 0) num = Math.abs(num);

    for (const n of num.toString().split(``).reverse()) {
        a++;
        formattedNum += ((a - 1) % 3) === 0 ? `,${n}` : n;
    }

    return formattedNum.slice(1).split(``).reverse().join(``);
};

const formatTime = (num: number) => {
    let str = `\``;

    if (Math.abs(num) >= 864e5) str += `${(Math.abs(num) / 864e5).toFixed(2)}\` days`;
    else if (Math.abs(num) >= 36e5) str += `${(Math.abs(num) / 36e5).toFixed(0)}\` hours`;
    else if (Math.abs(num) >= 6e4) str += `${(Math.abs(num) / 6e4).toFixed(0)}\` minutes`;
    else if (Math.abs(num) >= 1e3) str += `${(Math.abs(num) / 1e3).toFixed(2)}\` seconds`;
    else str += `${Math.abs(num)}\` milliseconds`;

    return str;
};

const formatTimeString = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60).toString().padStart(2, `0`);
    const minutes = Math.floor((ms / (1000 * 60)) % 60).toString().padStart(2, `0`);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24).toString().padStart(2, `0`);
    const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 365).toString().padStart(2, `0`);

    return `${days ? `**${days}**d ` : ``}**${hours}**h **${minutes}**m **${seconds}**s`;
};

export {
    capitalize,
    formatMoney,

    formatTime,
    formatTimeString
};

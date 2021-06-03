const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

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

export {
    capitalize,
    formatMoney,
    formatTime
};

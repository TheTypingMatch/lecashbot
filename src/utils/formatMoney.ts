const formatMoney = (num: number) => {
    // First, round the balance.
    num = Math.round(num);

    let a = 0;
    let formattedNum = ``;

    for (const n of num.toString().split(``).reverse()) {
        a++;
        formattedNum += ((a - 1) % 3) === 0 ? `,${n}` : n;
    }

    return formattedNum.slice(1).split(``).reverse().join(``);
};

export default formatMoney;

const currency = (n: string | number) => n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
const int = (str: string) => parseInt(str.replace(/[$,]/g, ""));

// capitalize first letter
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export {
    currency,
    int,
    capitalize
};

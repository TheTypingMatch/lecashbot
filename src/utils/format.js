const currency = n => n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
const int = str => parseInt(str.replace(/[$,]/g, ''));

// capitalize first letter
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

export {
    currency,
    int,
    capitalize
};

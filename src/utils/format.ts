const currency = n => n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
const int = str => parseInt(str.replace(/[$,]/g, ''))

export { currency, int }

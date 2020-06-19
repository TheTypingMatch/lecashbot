const currency = (n: string | number) => n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
const int = (str: string) => parseInt(str.replace(/[$,]/g, ''))

export { currency, int }

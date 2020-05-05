module.exports = {
    currency: n => n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
    int: str => parseInt(str.replace(/[$,]/g, ''))
}

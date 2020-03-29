const format = require('../src/utils/format')

test('Converts to correct comma syntax', () => {
    expect(format.currency('1000000')).toBe('1,000,000')
})

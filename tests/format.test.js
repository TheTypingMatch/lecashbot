const { int, currency } = require('../src/utils/format')

test('Converts to correct comma syntax', () => {
  expect(currency('1000000')).toBe('1,000,000')
})

test('Converts currency format to integer', () => {
  expect(int('$100,000')).toBe(100000)
})

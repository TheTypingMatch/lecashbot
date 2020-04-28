const field = require('../src/utils/field')

test('adds title field', () => {
  expect(field.addTitleField({
    title: 'description'
  })).toBe('**title** - description')
})

test('adds description field', () => {
  expect(field.addDescriptionField({
    description: 'description'
  })).toBe('description')
})

test('adds command field', () => {
  expect(field.addCommandField({
    name: '- description'
  })).toBe('`$name` - description')
})

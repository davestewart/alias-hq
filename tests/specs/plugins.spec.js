const aliases = require('../../src')
const fixtures = require('../fixtures')

// ---------------------------------------------------------------------------------------------------------------------
// setup
// ---------------------------------------------------------------------------------------------------------------------

function plugin (paths, options) {
  return Object.keys(paths).reduce((output, key) => {
    const alias = key.substring(1).replace('/*', '')
    const path = paths[key][0].replace('/*', '')
    output[alias] = { path }
    return output
  }, {})
}

// ---------------------------------------------------------------------------------------------------------------------
// tests
// ---------------------------------------------------------------------------------------------------------------------

describe('passing', function () {

  describe('a custom function', function () {
    it('should convert paths correctly', function () {
      const received = aliases.load('jsconfig.json').get(plugin)
      const expected = fixtures.custom
      expect(received).toEqual(expected)
    })
  })

  describe('an missing plugin name', function () {
    it('should throw an error', function () {
      const received = () => aliases.get('blah')
      expect(received).toThrowError()
    })
  })

  describe('an invalid plugin name', function () {
    it('should throw an error', function () {
      const received = () => aliases.get(123)
      expect(received).toThrowError()
    })
  })
})

describe('custom plugins', function () {
  it('should be addable', function () {
    aliases.plugins.add('test', plugin)
  })
  it('should be callable', function () {
    const received = aliases.get('test')
    const expected = fixtures.custom
    expect(received).toEqual(expected)
  })
})

describe('available plugins', function () {
  describe('should convert using defaults', function () {
    Object.keys(fixtures.plugins).forEach(key => {
      it(key, function () {
        const received = aliases.get(key)
        const expected = fixtures.plugins[key]
        expect(received).toEqual(expected)
      })
    })
  })
})


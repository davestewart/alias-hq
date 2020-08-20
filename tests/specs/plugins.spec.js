const aliases = require('../../src')
const fixtures = require('../fixtures')

// ---------------------------------------------------------------------------------------------------------------------
// tests
// ---------------------------------------------------------------------------------------------------------------------

describe('passing', function () {

  describe('a custom function', function () {
    function plugin (paths, options) {
      return Object.keys(paths).reduce((output, key) => {
        const alias = key.substring(1).replace('/*', '')
        const path = paths[key].replace('/*', '')
        output[alias] = { path }
        return output
      }, {})
    }
    const received = aliases.as(plugin)
    const expected = fixtures.custom
    it('should convert paths correctly', function () {
      expect(received).toEqual(expected)
    })
  })

  describe('an invalid plugin name', function () {
    it('should throw an error', function () {
      const received = () => aliases.as('blah')
      expect(received).toThrowError()
    })
  })
})

describe('available plugins', function () {
  describe('should convert using defaults', function () {
    Object.keys(fixtures.plugins).forEach(key => {
      const received = aliases.as(key)
      const expected = fixtures.plugins[key]
      it(key, function () {
        expect(received).toEqual(expected)
      })
    })
  })
})

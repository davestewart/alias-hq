const hq = require('../../src')
const fixtures = require('../fixtures')

// ---------------------------------------------------------------------------------------------------------------------
// setup
// ---------------------------------------------------------------------------------------------------------------------

function customPlugin (paths, options) {
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
      const received = hq.load('jsconfig.json').get(customPlugin)
      const expected = fixtures.custom
      expect(received).toEqual(expected)
    })
  })

  describe('a missing plugin name', function () {
    it('should throw an error', function () {
      const received = () => hq.get('blah')
      expect(received).toThrowError()
    })
  })

  describe('an invalid plugin name', function () {
    it('should throw an error', function () {
      const received = () => hq.get(123)
      expect(received).toThrowError()
    })
  })
})

describe('custom plugins', function () {
  it('should be addable', function () {
    hq.plugins.add('test', customPlugin)
  })
  it('should be callable', function () {
    const received = hq.get('test')
    const expected = fixtures.custom
    expect(received).toEqual(expected)
  })
})

describe('available plugins', function () {
  describe('should convert with options', function () {
    fixtures.plugins.forEach(plugin => {
      const { id, name, config, options } = plugin
      it(id, function () {
        const received = hq.get(name, options)
        const expected = config
        expect(received).toEqual(expected)
      })
    })
  })
})


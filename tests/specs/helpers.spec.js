const aliases = require('../../src')
const { rootUrl, config } = require('./globals')

// ---------------------------------------------------------------------------------------------------------------------
// tests
// ---------------------------------------------------------------------------------------------------------------------

describe('helpers', function () {

  describe('paths', function () {
    it('should load return the raw paths data', function () {
      const received = aliases.load('jsconfig.json').config.paths
      const expected = config.js
      expect(received).toEqual(expected)
    })
  })

  describe('rootUrl', function () {
    it('should return the current folder rootUrl', function () {
      const received = aliases.load().config.rootUrl
      const expected = rootUrl
      expect(received).toEqual(expected)
    })
  })

  describe('plugins', function () {
    it('should return plugin names', function () {
      aliases.plugins.add('xyz', function () {})
      const received = aliases.plugins.names
      const expected = ['jest', 'rollup', 'webpack', 'xyz']
      expect(received).toEqual(expected)
    })
  })
})

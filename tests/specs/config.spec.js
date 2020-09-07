const hq = require('../../src')
const { rootUrl, config } = require('../globals')

// ---------------------------------------------------------------------------------------------------------------------
// tests
// ---------------------------------------------------------------------------------------------------------------------

describe('config', function () {

  describe('paths', function () {
    it('should load return the raw paths data', function () {
      const received = hq.load('demo/jsconfig.json').config.paths
      const expected = config.js
      expect(received).toEqual(expected)
    })
  })

  describe('rootUrl', function () {
    it('should return the current folder rootUrl', function () {
      const received = hq.load().config.rootUrl
      const expected = rootUrl
      expect(received).toEqual(expected)
    })
  })

  describe('plugins', function () {
    it('should return plugin names', function () {
      hq.plugins.add('xyz', function () {})
      const received = hq.plugins.names
      const expected = ['jest', 'rollup', 'webpack', 'xyz']
      expect(received).toEqual(expected)
    })
  })
})

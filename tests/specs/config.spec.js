const Fs = require('fs')
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
      // eslint-disable-next-line node/no-path-concat
      const names = Fs.readdirSync(__dirname + '/../../src/plugins/')
      hq.plugins.add('xyz', function () {})
      const expected = [...names, 'xyz'].sort()
      const received = hq.plugins.names
      expect(received).toEqual(expected)
    })
  })
})

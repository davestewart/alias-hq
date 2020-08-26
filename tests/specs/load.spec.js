const hq = require('../../src')
const { rootUrl, config } = require('../globals')

// ---------------------------------------------------------------------------------------------------------------------
// tests
// ---------------------------------------------------------------------------------------------------------------------

describe('calling load and passing', function () {

  describe('nothing', function () {
    it('should load the default file', function () {
      const received = hq.load().config.paths
      const expected = config.default
      expect(received).toEqual(expected)
    })
  })

  describe('relative filepath', function () {
    it('should load the file', function () {
      const received = hq.load('tsconfig.base.json').config.paths
      const expected = config.js
      expect(received).toEqual(expected)
    })
  })

  describe('absolute filepath', function () {
    it('should load the file', function () {
      const received = hq.load(rootUrl + '/tsconfig.base.json').config.paths
      const expected = config.ts
      expect(received).toEqual(expected)
    })
  })

  describe('invalid filepath', function () {
    it('should throw an error', function () {
      const received = () => hq.load('xxx')
      expect(received).toThrowError()
    })
  })

  describe('any other value', function () {
    it('null should throw an error', function () {
      const received = () => hq.load(null)
      expect(received).toThrowError()
    })
    it('a number should throw an error', function () {
      const received = () => hq.load(100)
      expect(received).toThrowError()
    })
    it('a Date should throw an error', function () {
      const received = () => hq.load(new Date())
      expect(received).toThrowError()
    })
    it('an object should throw an error', function () {
      const received = () => hq.load({})
      expect(received).toThrowError()
    })
  })
})

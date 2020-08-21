const aliases = require('../../src')
const { root, config } = require('./globals')

// ---------------------------------------------------------------------------------------------------------------------
// tests
// ---------------------------------------------------------------------------------------------------------------------

describe('calling load and passing', function () {

  describe('nothing', function () {
    it('should load the default file', function () {
      const received = aliases.load().config.paths
      const expected = config.default
      expect(received).toEqual(expected)
    })
  })

  describe('relative filepath', function () {
    it('should load the file', function () {
      const received = aliases.load('jsconfig.json').config.paths
      const expected = config.js
      expect(received).toEqual(expected)
    })
  })

  describe('absolute filepath', function () {
    it('should load the file', function () {
      const received = aliases.load(root + '/tsconfig.json').config.paths
      const expected = config.ts
      expect(received).toEqual(expected)
    })
  })

  describe('invalid filepath', function () {
    it('should throw an error', function () {
      const received = () => aliases.load('xxx')
      expect(received).toThrowError()
    })
  })

  describe('an object', function () {
    it('should set the object as paths', function () {
      const received = aliases.load(config.custom).config.paths
      const expected = config.custom
      expect(received).toEqual(expected)
    })
  })

  describe('any other value', function () {
    it('null should throw an error', function () {
      const received = () => aliases.load(null)
      expect(received).toThrowError()
    })
    it('a number should throw an error', function () {
      const received = () => aliases.load(100)
      expect(received).toThrowError()
    })
    it('a Date should throw an error', function () {
      const received = () => aliases.load(new Date())
      expect(received).toThrowError()
    })
    it('an empty object should throw an error', function () {
      const received = () => aliases.load({})
      expect(received).toThrowError()
    })
  })
})

const hq = require('../../src')
const { rootUrl, config } = require('../globals')

// ---------------------------------------------------------------------------------------------------------------------
// tests
// ---------------------------------------------------------------------------------------------------------------------

describe('calling load and passing', function () {

  describe('nothing', function () {
    it('should load the default file', async function () {
      const received = (await hq.load()).config.paths
      const expected = config.default
      expect(received).toEqual(expected)
    })
  })

  describe('relative filepath', function () {
    it('should load the file', async function () {
      const received = (await hq.load('demo/tsconfig.base.json')).config.paths
      const expected = config.js
      expect(received).toEqual(expected)
    })
  })

  describe('absolute filepath', function () {
    it('should load the file', async function () {
      const received = (await hq.load(rootUrl + '/tsconfig.base.json')).config.paths
      const expected = config.ts
      expect(received).toEqual(expected)
    })
  })

  describe('invalid filepath', function () {
    it('should throw an error', function () {
      const received = async () => await hq.load('xxx')
      expect(received).rejects.toThrowError()
    })
  })

  describe('any other value', function () {
    it('null should throw an error', function () {
      const received = async () => await hq.load(null)
      expect(received).rejects.toThrowError()
    })
    it('a number should throw an error', function () {
      const received = async () => await hq.load(100)
      expect(received).rejects.toThrowError()
    })
    it('a Date should throw an error', function () {
      const received = async () => await hq.load(new Date())
      expect(received).rejects.toThrowError()
    })
    it('an object should throw an error', function () {
      const received = async () => await hq.load({})
      expect(received).rejects.toThrowError()
    })
  })
})

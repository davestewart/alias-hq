const Path = require('path')
const hq = require('../../../src')
const { getPathsInfo, cleanPathsInfo } = require('../../../cli/services/paths')

let rootUrl

function test (input, output, valid = true, sort = true, dedupe = true) {
  const dirty = getPathsInfo(input, rootUrl)
  const clean = cleanPathsInfo(dirty, valid, sort, dedupe)
  const final = clean.map(info => info.relPath)
  expect(final).toEqual(output)
}

beforeAll(function () {
  hq.load()
  rootUrl = Path.resolve(hq.config.rootUrl)
})

describe('cleanPathsInfo', function () {
  describe('default parameters', function () {
    it('should discard invalid paths', function () {
      test('../ / /test', [])
    })

    it('should resolve root path', function () {
      test('. ../ demo demo/.. ../alias-hq demo/src demo/src/app', ['.'])
    })

    it('should should resolve child path', function () {
      test('demo ../ demo/src demo/src/app', ['demo'])
    })

    it('should resolve multiple root paths', function () {
      test('demo/src/foo/.. demo/src demo/packages demo/src/app', [
        'demo/packages',
        'demo/src',
      ])
    })
  })

  describe('valid only', function () {
    it('should return only valid paths', function () {
      const input = '. ../ demo demo/.. ../alias-hq demo/src/app demo/src'
      const output = [
        '.',
        'demo',
        'demo/src/app',
        'demo/src',
      ]
      test(input, output, true, false, false)
    })
  })
})

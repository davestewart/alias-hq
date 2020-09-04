const Path = require('path')
const { getPathsInfo } = require('../../../cli/utils/paths')

describe('cli utils', function () {
  it('getPathsInfo should dedupe paths', function () {

    const rootUrl = Path.resolve('')
    const paths = [
      {
        actual: '. ../ demo demo/.. ../alias-hq demo/src demo/src/app',
        expected: ['.'],
      },
      {
        actual: 'demo ../ demo/src demo/src/app',
        expected: ['demo'],
      },
      {
        actual: 'demo/src/foo/.. demo/src demo/packages demo/src/app',
        expected: [
          'demo/packages',
          'demo/src',
        ],
      },
    ]

    paths.forEach(path => {
      const info = getPathsInfo(path.actual, rootUrl)
      const expected = info
        .filter(info => info.valid)
        .map(info => info.path)
      expect(path.expected).toEqual(expected)
    })
  })
})

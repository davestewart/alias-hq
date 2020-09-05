const hq = require('../../../src')
const { abs } = require('../../../src/utils')
const { getAliases } = require('../../../cli/utils/config')

beforeAll(function () {
  hq.load()
})

describe('cli alias configuration', function () {

  it('alias keys should be in file order ', function () {
    const { keys } = getAliases()
    const expected = [
      '@',
      '@packages',
      '@classes',
      '@app',
      '@data',
      '@services',
      '@views',
    ]
    expect(keys).toEqual(expected)
  })

  it('alias lookups should be in reverse path order', function () {

    const { lookup } = getAliases()
    const expected = [
      {
        alias: '@classes',
        absPath: abs('classes'),
        relPath: 'src/classes',
      },
      {
        alias: '@views',
        absPath: abs('app/views'),
        relPath: 'src/app/views',
      },
      {
        alias: '@services',
        absPath: abs('app/services'),
        relPath: 'src/app/services',
      },
      {
        alias: '@data',
        absPath: abs('app/data'),
        relPath: 'src/app/data',
      },
      {
        alias: '@app',
        absPath: abs('app'),
        relPath: 'src/app',
      },
      {
        alias: '@',
        absPath: abs(''),
        relPath: 'src',
      },
      {
        alias: '@packages',
        absPath: abs('../packages'),
        relPath: 'packages',
      }
    ]
    expect(lookup).toEqual(expected)
  })
})

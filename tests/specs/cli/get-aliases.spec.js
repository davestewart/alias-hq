const hq = require('../../../src')
const { abs } = require('../../../src/utils')
const { getAliases } = require('../../../cli/services/config')

beforeAll(function () {
  hq.load()
})

describe('cli alias configuration', function () {
  it('alias names should be in file order ', function () {
    const { names } = getAliases()
    const expected = [
      '@',
      '@packages',
      '@classes',
      '@app',
      '@data',
      '@settings',
      '@services',
      '@views',
    ]
    expect(names).toEqual(expected)
  })

  it('alias lookups should be in reverse path order', function () {
    const { lookup } = getAliases()
    const expected = [
      {
        name: '@classes',
        absPath: abs('classes'),
        relPath: 'src/classes',
      },
      {
        name: '@views',
        absPath: abs('app/views'),
        relPath: 'src/app/views',
      },
      {
        name: '@settings',
        absPath: abs('app/settings.js'),
        relPath: 'src/app/settings.js',
      },
      {
        name: '@services',
        absPath: abs('app/services'),
        relPath: 'src/app/services',
      },
      {
        name: '@data',
        absPath: abs('app/data'),
        relPath: 'src/app/data',
      },
      {
        name: '@app',
        absPath: abs('app'),
        relPath: 'src/app',
      },
      {
        name: '@',
        absPath: abs(''),
        relPath: 'src',
      },
      {
        name: '@packages',
        absPath: abs('../packages'),
        relPath: 'packages',
      }
    ]
    expect(lookup).toEqual(expected)
  })
})

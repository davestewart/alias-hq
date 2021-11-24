const hq = require('../../../src')
const { abs, inspect } = require('../../../src/utils')
const { getAliases } = require('../../../cli/services/config')
const { toRelative } = require('../../../cli/modules/source/transformer/paths')

// ---------------------------------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------------------------------

let aliases
let modules = [
  '@packages'
]

function test (relSourceFile, targetPath, expected) {
  const actual = toRelative(abs(relSourceFile), targetPath, { aliases, modules })
  expect(actual).toBe(expected)
}

// ---------------------------------------------------------------------------------------------------------------------
// configured aliases
// ---------------------------------------------------------------------------------------------------------------------

// @          - demo/src
// @app       - demo/src/app
// @data      - demo/src/app/data
// @services  - demo/src/app/services
// @views     - demo/src/app/views
// @classes   - demo/src/classes
// @packages  - demo/packages *
//
// * module

// ---------------------------------------------------------------------------------------------------------------------
// tests
// ---------------------------------------------------------------------------------------------------------------------

beforeAll(async function () {
  await hq.load()
  aliases = await getAliases()
})

describe('demo code', function () {

  it('should resolve @packages from @services', () => {
    test('app/services/foo.js',
      '@packages/services/foo',
      '../../../packages/services/foo')
  })

  it('should resolve @classes from @data', function () {
    test('app/data/models/user.js',
      '@classes/user',
      '../../../classes/user')
  })

  it('should resolve @config from @data', function () {
    test('app/data/models/user.js',
      '@/config/api',
      '../../../config/api')
  })

  it('should resolve @views from main', function () {
    test('main.js',
      '@views/user',
      './app/views/user')
  })

  it('should resolve @packages from @classes', function () {
    test('classes/User.js',
      '@packages/fetch',
      '../../packages/fetch')
  })

  it('should resolve @data from @views', function () {
    test('app/views/user.js',
      '@data/models/user',
      '../data/models/user')
  })

})

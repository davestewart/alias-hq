const hq = require('../../../src')
const { abs } = require('../../../src/utils')
const { getAliases } = require('../../../cli/services/config')
const { toAlias } = require('../../../cli/modules/source/transformer/paths')

// ---------------------------------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------------------------------

let aliases
const modules = [
  '@packages'
]

function test (relSourceFile, targetPath, expected = undefined) {
  const actual = toAlias(abs(relSourceFile), targetPath, { aliases, modules })
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

beforeAll(function () {
  hq.load()
  aliases = getAliases()
})

describe('core transforms', function () {
  describe('relative paths', function () {
    it('should retain downstream paths', function () {
      test('app/data/foo.js', './bar.js')
      test('app/data/foo.js', './bar/baz.js')
    })

    it('should retain upstream paths within current alias', function () {
      test('app/data/users/user.js', '../index.js')
    })

    it('should take parent alias above current alias', function () {
      test('app/data/users/user.js', '../../index.js', '@app/index.js')
    })

    it('should take child alias below current alias', function () {
      test('app/settings.js', './data/users.js', '@data/users.js')
    })

    it('should take sibling alias when crossing boundaries', function () {
      test('app/data/users.js', '../services/users.js', '@services/users.js')
    })
  })

  describe('modules', function () {
    // @packages is marked as a module root
    it('should retain paths within the current module ', function () {
      test('../packages/fetch/data/index.js', '../settings.js')
      test('../packages/fetch/foo/bar/baz/index.js', '../settings.js')
      test('../packages/fetch/foo/bar/baz/index.js', '../../../settings.js')
    })

    it('should take module alias outside current module', function () {
      test('../packages/fetch/index.js', '../services/foo.js', '@packages/services/foo.js')
      test('../packages/fetch/data/index.js', '../../services/foo.js', '@packages/services/foo.js')
    })
  })

  describe('existing aliases', function () {
    it('should take downstream aliases if available', function () {
      test('index.js', '@/app/settings.js', '@settings')
      test('index.js', '@/app/data/users.js', '@data/users.js')
    })

    it('should retain alias if none downstream', function () {
      test('index.js', '@data/settings.js')
    })

    it('should take upstream alias if available', function () {
      // this doesn't make sense unless going @data/../foo.js
    })
  })

  describe('node modules', function () {
    it('should retain npm modules', function () {
      test('index.js', 'vue')
    })

    it('should retain namespaced npm modules', function () {
      test('index.js', '@vue/vuex')
    })
  })
})

describe('demo code', function () {
  it('should resolve @packages from @services', () => {
    test('app/services/foo.js',
      '../../../packages/services/foo',
      '@packages/services/foo')
  })

  it('should resolve @classes from @data', function () {
    test('app/data/models/user.js',
      '../../../classes/user',
      '@classes/user')
  })

  it('should resolve @config from @data', function () {
    test('app/data/models/user.js',
      '../../../config/api',
      '@/config/api')
  })

  it('should resolve @views from main', function () {
    test('main.js',
      './app/views/user',
      '@views/user')
  })

  it('should resolve @packages from @classes', function () {
    test('classes/User.js',
      '../../packages/fetch',
      '@packages/fetch')
  })

  it('should resolve @data from @views', function () {
    test('app/views/user.js',
      '@/app/data/models/user',
      '@data/models/user')
  })
})

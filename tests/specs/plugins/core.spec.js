const hq = require('../../../src')

// ---------------------------------------------------------------------------------------------------------------------
// tests
// ---------------------------------------------------------------------------------------------------------------------

beforeAll(async function () {
  await hq.load()
})

describe('a missing plugin name', function () {
  it('should throw an error', function () {
    const received = async () => await hq.get('blah')
    expect(received).rejects.toThrowError()
  })
})

describe('an invalid plugin name', function () {
  it('should throw an error', function () {
    const received = async () => await hq.get(123)
    expect(received).rejects.toThrowError()
  })
})

describe('core plugins:', function () {

  // setup
  const plugins = hq.plugins.names.map(name => {
    return {
      name,
      tests: require(`../../../src/plugins/${name}/tests.js`)
    }
  })

  // test each plugin
  plugins.forEach(plugin => {
    describe(`plugin: ${plugin.name}`, function () {
      it('should have at least one test', function () {
        expect(Array.isArray(plugin.tests)).toBe(true)
        expect(plugin.tests.filter(test => typeof test === 'function').length).toBeGreaterThan(0)
      })

      describe('each test:', function () {
        plugin.tests.forEach(test => {
          if (typeof test === 'function') {
            const result = test()
            const label = result
              ? result.label || 'default'
              : 'unknown'

            describe(`test: ${label}`, function () {
              it('should return an object', function () {
                expect(result && typeof result === 'object' && Object.keys(result).length > 0).toBeTruthy()
              })

              it('should receive an "expected" value', function () {
                expect(result.expected).toBeTruthy()
              })

              if (plugin.tests.length > 1) {
                it('should receive a value "label"', function () {
                  expect(typeof result.label).toBe('string')
                })
              }

              it('should correctly convert example paths', async function () {
                const received = await hq.get(plugin.name, result.options)
                expect(received).toEqual(result.expected)
              })
            })
          }
        })
      })
    })
  })

})

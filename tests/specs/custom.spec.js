const hq = require('../../src')

// ---------------------------------------------------------------------------------------------------------------------
// setup
// ---------------------------------------------------------------------------------------------------------------------

function plugin (paths, options) {
  return Object.keys(paths).reduce((output, key) => {
    const alias = key.substring(1).replace('/*', '')
    const path = paths[key][0].replace('/*', '')
    output[alias] = { path }
    return output
  }, {})
}

const expected = {
  'api': { path: 'api' },
  'app': { path: 'app' },
  'config': { path: 'app/config' },
  'services': { path: 'app/services' },
  'utils': { path: 'common/utils' },
}

// ---------------------------------------------------------------------------------------------------------------------
// tests
// ---------------------------------------------------------------------------------------------------------------------

describe('custom plugins', function () {
  it('should be addable', function () {
    hq.plugins.add('test', plugin)
  })
  it('should be callable', function () {
    const received = hq.get('test')
    expect(received).toEqual(expected)
  })
  it('should convert paths correctly', function () {
    const received = hq.load('jsconfig.json').get(plugin)
    expect(received).toEqual(expected)
  })
})

const hq = require('../../../src')

// ---------------------------------------------------------------------------------------------------------------------
// setup
// ---------------------------------------------------------------------------------------------------------------------

function plugin (config, options = null) {
  const { paths } = config
  return Object.keys(paths).reduce((output, key) => {
    const name = key.substring(1).replace('/*', '')
    const path = paths[key][0].replace('/*', '')
    output[name] = { path }
    return output
  }, {})
}

const expected = {
  '': { path: '' },
  packages: { path: '../packages' },
  classes: { path: 'classes' },
  app: { path: 'app' },
  data: { path: 'app/data' },
  settings: { path: 'app/settings.js' },
  services: { path: 'app/services' },
  views: { path: 'app/views' },
}

// ---------------------------------------------------------------------------------------------------------------------
// tests
// ---------------------------------------------------------------------------------------------------------------------

beforeAll(function () {
  hq.load()
})

describe('custom plugins', function () {
  it('should be addable', function () {
    hq.plugins.add('test', plugin)
  })

  it('should be callable', function () {
    hq.plugins.add('test', plugin)
    const received = hq.get('test')
    expect(received).toEqual(expected)
  })

  it('should convert paths correctly', function () {
    const received = hq.load('demo/jsconfig.json').get(plugin)
    expect(received).toEqual(expected)
  })
})

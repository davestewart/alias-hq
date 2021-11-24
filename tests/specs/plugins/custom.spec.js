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
  'packages': { path: '../packages' },
  'classes': { path: 'classes' },
  'app': { path: 'app' },
  'data': { path: 'app/data' },
  'services': { path: 'app/services' },
  'views': { path: 'app/views' },
}

// ---------------------------------------------------------------------------------------------------------------------
// tests
// ---------------------------------------------------------------------------------------------------------------------

beforeAll(async function () {
  await hq.load()
})

describe('custom plugins', function () {
  it('should be addable', function () {
    hq.plugins.add('test', plugin)
  })
  it('should be callable', async function () {
    hq.plugins.add('test', plugin)
    const received = await hq.get('test')
    expect(received).toEqual(expected)
  })
  it('should convert paths correctly', async function () {
    const received = await (await hq.load('demo/jsconfig.json')).get(plugin)
    expect(received).toEqual(expected)
  })
})

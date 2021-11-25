const Path = require('path')
const { abs } = require('../../src/utils')

describe('abs()', function () {
  const get = path => Path.resolve(__dirname, '../../demo/src/' + path)

  it('"" should return the correct path', function () {
    expect(abs('')).toBe(get(''))
  })
  it('"/" should return the correct path', function () {
    expect(abs('/')).toBe(get('/'))
  })
  it('"/down" should return the correct path', function () {
    expect(abs('/down')).toBe(get('/down'))
  })
  it('"../up" should return the correct path', function () {
    expect(abs('../up')).toBe(get('../up'))
  })
})

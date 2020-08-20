const Path = require('path')
const aliases = require('../src')

// ---------------------------------------------------------------------------------------------------------------------
// setup
// ---------------------------------------------------------------------------------------------------------------------

// helpers
function testWebpack (values) {
  return expect(values).toEqual({
    '@api': '/Volumes/Data/Work/OpenSource/JavaScript/Aliases/alias-hq/api',
    '@app': '/Volumes/Data/Work/OpenSource/JavaScript/Aliases/alias-hq/app',
    '@config': '/Volumes/Data/Work/OpenSource/JavaScript/Aliases/alias-hq/app/config',
    '@shared': '/Volumes/Data/Work/OpenSource/JavaScript/Aliases/alias-hq/app/shared',
    '@helpers': '/Volumes/Data/Work/OpenSource/JavaScript/Aliases/alias-hq/common/helpers'
  })
}

function testJest (values) {
  return expect(values).toEqual({
    '^@api/(.*)$': '<rootDir>/api/$1',
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^@config/(.*)$': '<rootDir>/app/config/$1',
    '^@shared/(.*)$': '<rootDir>/app/shared/$1',
    '^@helpers/(.*)$': '<rootDir>/common/helpers/$1'
  })
}

// variables
const root = Path.resolve('.')
const path = Path.resolve('./tsconfig.json')
const config = require('../tsconfig.json')

// ---------------------------------------------------------------------------------------------------------------------
// tests
// ---------------------------------------------------------------------------------------------------------------------

describe('should convert webpack', function () {
  it('with no value', function () {
    testWebpack(aliases.toWebpack())
  })
  it('with a path', function () {
    testWebpack(aliases.toWebpack(path))
  })
  it('with an object', function () {
    testWebpack(aliases.toWebpack(config, { root }))
  })
})

describe('should convert jest', function () {
  it('with no value', function () {
    testJest(aliases.toJest())
  })
  it('with a path', function () {
    testJest(aliases.toJest(path))
  })
  it('with an object', function () {
    testJest(aliases.toJest(config))
  })
})

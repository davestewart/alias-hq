const root = require('app-root-path').toString()

// helpers
function rel (path) {
  return `./src/${path}`
}

function abs (path) {
  return `${root}/src/${path}`
}

function plugin (id, config, options = {}) {
  const name = id.split(':').shift()
  return { id, name, config, options }
}

// fixtures
module.exports = [

  // webpack
  plugin('webpack', {
    '@api': abs('api'),
    '@app': abs('app'),
    '@config': abs('app/config'),
    '@services': abs('app/services'),
    '@utils': abs('common/utils'),
  }),

  // jest
  plugin('jest', {
    '^@api/(.*)$': '<rootDir>/src/api/$1',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@config/(.*)$': '<rootDir>/src/app/config/$1',
    '^@services/(.*)$': '<rootDir>/src/app/services/$1',
    '^@utils/(.*)$': [
      '<rootDir>/src/common/utils/$1',
      '<rootDir>/src/vendor/utils/$1',
    ],
  }),

  // rollup, object
  plugin('rollup:object', {
    '@api': abs('api'),
    '@app': abs('app'),
    '@config': abs('app/config'),
    '@services': abs('app/services'),
    '@utils': abs('common/utils'),
  }, {
    format: 'object'
  }),

  // rollup, array
  plugin('rollup:array', [
      {
        find: '@api',
        replacement: abs('api'),
      },
      {
        find: '@app',
        replacement: abs('app'),
      },
      {
        find: '@config',
        replacement: abs('app/config'),
      },
      {
        find: '@services',
        replacement: abs('app/services'),
      },
      {
        find: '@utils',
        replacement: abs('common/utils'),
      }
    ], {
    format: 'array'
  }),

  // add new plugin fixtures here...
]

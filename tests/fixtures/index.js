const Path = require('path')

// helpers
const root = Path.resolve(__dirname, '../../')
function src (path) {
  return `${root}/${path}`
}

// fixtures
const plugins = {
  webpack: {
    '@api': src('api'),
    '@app': src('app'),
    '@config': src('app/config'),
    '@services': src('app/services'),
    '@utils': src('common/utils'),
  },

  jest: {
    '^@api/(.*)$': '<rootDir>/api/$1',
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^@config/(.*)$': '<rootDir>/app/config/$1',
    '^@services/(.*)$': '<rootDir>/app/services/$1',
    '^@utils/(.*)$': '<rootDir>/common/utils/$1',
  },

  rollup: [
    {
      find: '@api',
      replacement: src('api'),
    },
    {
      find: '@app',
      replacement: src('app'),
    },
    {
      find: '@config',
      replacement: src('app/config'),
    },
    {
      find: '@services',
      replacement: src('app/services'),
    },
    {
      find: '@utils',
      replacement: src('common/utils'),
    }
  ]
}

const custom = {
  'api': { path: 'api' },
  'app': { path: 'app' },
  'config': { path: 'app/config' },
  'services': { path: 'app/services' },
  'utils': { path: 'common/utils' },
}

// export
module.exports = {
  plugins,
  custom,
}

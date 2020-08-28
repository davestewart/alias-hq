const { abs } = require('../../utils')

module.exports = [
  function () {
    const label = 'object'
    const options = {
      format: 'object'
    }
    const expected = {
      '@api': abs('api'),
      '@app': abs('app'),
      '@config': abs('app/config'),
      '@services': abs('app/services'),
      '@utils': abs('common/utils'),
    }
    return { label, options, expected }
  },

  function () {
    const label = 'array'
    const options = {
      format: 'array'
    }
    const expected = [
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
    ]
    return { label, options, expected }
  },
]

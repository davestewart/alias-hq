const { abs } = require('../../utils')

const expected = {
  '@': abs(''),
  '@packages': abs('../packages'),
  '@classes': abs('classes'),
  '@app': abs('app'),
  '@data': abs('app/data'),
  '@settings': abs('app/settings.js'),
  '@services': abs('app/services'),
  '@views': abs('app/views'),
  '@alias-hq': abs('../../src'),
}

module.exports = [
  function () {
    const label = 'default'
    const options = {}
    return { label, options, expected }
  },

  function () {
    const label = 'object'
    const options = {
      format: 'object'
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
        find: '@',
        replacement: abs(''),
      },
      {
        find: '@packages',
        replacement: abs('../packages'),
      },
      {
        find: '@classes',
        replacement: abs('classes')
      },
      {
        find: '@app',
        replacement: abs('app')
      },
      {
        find: '@data',
        replacement: abs('app/data')
      },
      {
        find: '@settings',
        replacement: abs('app/settings.js')
      },
      {
        find: '@services',
        replacement: abs('app/services')
      },
      {
        find: '@views',
        replacement: abs('app/views')
      },
      {
        find: '@alias-hq',
        replacement: abs('../../src')
      },
    ]
    return { label, options, expected }
  },
]

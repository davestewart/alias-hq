const { abs } = require('../../utils')

module.exports = [
  function () {
    const label = 'object'
    const options = {
      format: 'object'
    }
    const expected = {
      '@': abs(''),
      '@packages': abs('../packages'),
      '@classes': abs('classes'),
      '@app': abs('app'),
      '@data': abs('app/data'),
      '@services': abs('app/services'),
      '@views': abs('app/views'),
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
        find: '@services',
        replacement: abs('app/services')
      },
      {
        find: '@views',
        replacement: abs('app/views')
      },
    ]
    return { label, options, expected }
  },
]

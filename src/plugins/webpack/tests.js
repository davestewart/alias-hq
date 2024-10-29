const { abs } = require('../../utils')

module.exports = [
  function () {
    const label = 'string'
    const options = {
      format: 'string',
    }
    const expected = {
      '@': abs(''),
      '@packages': abs('../packages'),
      '@classes': abs('classes'),
      '@app': abs('app'),
      '@data': abs('app/data'),
      '@services': abs('app/services'),
      '@views': abs('app/views'),
      '@settings': abs('app/settings.js'),
      '@alias-hq': abs('../../src'),
    }
    return { label, options, expected }
  },

  function () {
    const label = 'array'
    const options = {
      format: 'array',
    }
    const expected = {
      '@': abs(''),
      '@packages': abs('../packages'),
      '@classes': abs('classes'),
      '@app': abs('app'),
      '@data': abs('app/data'),
      '@services': [
        abs('app/services'),
        abs('../packages/services'),
      ],
      '@views': abs('app/views'),
      '@settings': abs('app/settings.js'),
      '@alias-hq': abs('../../src'),
    }
    return { label, options, expected }
  },
]

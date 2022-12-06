const { abs } = require('../../utils')

module.exports = [
  function () {
    const expected = {
      '@': abs(''),
      '@packages': abs('../packages'),
      '@classes': abs('classes'),
      '@app': abs('app'),
      '@data': abs('app/data'),
      '@services': abs('app/services'),
      '@views': abs('app/views'),
      '@settings': abs('app/settings.js'),
    }
    return { expected }
  },
]

const { abs } = require('../../utils')

module.exports = [
  function () {
    const expected = {
      '@api': abs('api'),
      '@app': abs('app'),
      '@config': abs('app/config'),
      '@services': abs('app/services'),
      '@utils': abs('common/utils'),
    }
    return { expected }
  },
]

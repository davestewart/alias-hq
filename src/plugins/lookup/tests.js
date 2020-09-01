const { abs } = require('../../utils')

module.exports = [
  function () {
    const expected = [
      {
        alias: '@classes',
        path: abs('classes'),
      },
      {
        alias: '@views',
        path: abs('app/views'),
      },
      {
        alias: '@services',
        path: abs('app/services'),
      },
      {
        alias: '@data',
        path: abs('app/data'),
      },
      {
        alias: '@app',
        path: abs('app'),
      },
      {
        alias: '@',
        path: abs(''),
      },
      {
        alias: '@packages',
        path: abs('../packages'),
      }
    ]
    return { expected }
  },
]

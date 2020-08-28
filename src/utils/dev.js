const inspect = require('util').inspect

module.exports = {
  inspect (values) {
    console.log(inspect(values, { depth: 5 }))
  }
}

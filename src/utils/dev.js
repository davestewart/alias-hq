const inspect = require('util').inspect

module.exports = {
  inspect (values, depth) {
    let options = {
      depth,
      breakLength: 1,
      colors: true
    }
    console.log(inspect(values, options))
  }
}

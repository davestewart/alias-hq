const inspect = require('util').inspect

module.exports = {
  inspect (values, depth, indent = 0) {
    const options = {
      depth,
      breakLength: 1,
      colors: true
    }
    let text = inspect(values, options)
    if (indent) {
      const padding = ' '.repeat(indent)
      text = text.replace(/^/gm, padding)
    }
    console.log(text)
  }
}

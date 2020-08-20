const aliases = require('..')

function log (format, aliases) {
  console.log({ format, aliases })
}

log('Webpack', aliases.toWebpack())
log('Jest', aliases.toJest())

const inspect = require('../../src/utils').inspect

function isObject (value) {
  return value && typeof value === 'object' && !Array.isArray(value)
}

module.exports = {
  isObject,
  inspect
}

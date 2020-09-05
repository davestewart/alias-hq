const Path = require('path')

/**
 * Slightly more robust version of resolve
 *
 * Prevents issue where only / is returned if passed in one segment
 * @returns {string}
 */
function resolve (...pathSegments) {
  return Path.resolve(Path.join(...pathSegments))
}

module.exports = {
  join: Path.join,
  resolve,
}

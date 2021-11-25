/**
 * Check if a PathInfo object is valid and optionally exists
 *
 * @param   {PathInfo}  info
 * @param   {boolean}   exists
 * @returns {boolean}
 */
function isPathValid (info, exists) {
  return info.valid && (exists ? info.exists : true)
}

/**
 * Ensure strings with spaces are quoted
 *
 * @param text
 * @returns {string|*}
 */
function getPathString (text) {
  return text.includes(' ')
    ? `"${text}"`
    : text
}

/**
 * Convert a string of text containing folders to an array of folders
 *
 * Handles quotes, spaces, etc
 *
 * @param   {string}    text
 * @returns {string[]}
 */
function parsePathsFromText (text) {
  text = text.trim()
  const rx = /(["'])(.+?)\1|(\S+)/g
  let match
  const paths = []
  // eslint-disable-next-line no-cond-assign
  while (match = rx.exec(text)) {
    const path = match[1] ? match[2] : match[0]
    paths.push(path)
  }
  return paths
}

module.exports = {
  parsePathsFromText,
  getPathString,
  isPathValid,
}

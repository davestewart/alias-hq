const Path = require('path')
const Fs = require('fs')
const hq = require('../../src')

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
 * Returns information about a path relative to a root
 *
 * @param   {string}  rootUrl
 * @param   {string}  path
 * @return  {PathInfo}
 */
function getPathInfo (rootUrl, path) {
  // TODO externalise this
  const absRoot = hq.config.rootUrl

  // properties
  const absPath = Path.resolve(rootUrl, path)
  let relPath = Path.relative(rootUrl, absPath)
  const folder = Path.basename(absPath)
  const exists = Fs.existsSync(absPath)
  const valid = !Path.relative(absRoot, absPath).startsWith('..')

  // corrections
  if (relPath === '') {
    relPath = '.'
  }

  /**
   * Information about a path
   *
   * @typedef   {object}  PathInfo
   * @property  {string}  absPath     The absolute path
   * @property  {string}  relPath     The relative path
   * @property  {string}  folder      The name of the leaf folder
   * @property  {string}  exists      The path exists
   * @property  {string}  valid       The path is at the same level or below the config root
   */
  return {
    absPath,
    relPath,
    folder,
    exists,
    valid,
  }
}

/**
 * Grab paths from input
 *
 * @param   {string}    text
 * @param   {string}    rootUrl
 * @param   {boolean}   dedupe
 * @returns {PathInfo[]}
 */
function getPathsInfo (text, rootUrl, dedupe = true) {
  // basic info
  const infos = parsePathsFromText(text)
    .map(path => getPathInfo(rootUrl, path))

  // dedupe
  if (dedupe) {
    const hash = {}
    return infos
      .filter(info => {
        const absPath = info.absPath
        if (!hash[absPath]) {
          hash[absPath] = absPath
          return true
        }
        return false
      })
  }

  // return
  return infos
}

/**
 * Clean an array of PathInfo objects
 *
 * @param   {PathInfo[]}  infos
 * @param   {boolean}     valid
 * @param   {boolean}     sort
 * @param   {boolean}     unnest
 * @returns {PathInfo[]}
 */
function cleanPathsInfo (infos, valid = true, sort = true, unnest = true) {
  let output = [...infos]
  if (valid) {
    output = output.filter(info => info.valid)
  }
  if (sort) {
    output = output
      .sort(function (a, b) {
        return a.absPath < b.absPath
          ? -1
          : a.absPath > b.absPath
            ? 1
            : 0
      })
  }
  if (unnest) {
    output = output
      .reduce((output, input) => {
        if (!output.find(o => input.absPath.startsWith(o.absPath))) {
          output.push(input)
        }
        return output
      }, [])
  }

  return output
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
  let paths = []
  while (match = rx.exec(text)) {
    const path = match[1] ? match[2] : match[0]
    paths.push(path)
  }
  return paths
}

module.exports = {
  parsePathsFromText,
  cleanPathsInfo,
  getPathsInfo,
  getPathInfo,
  getPathString,
  isPathValid,
}

const Path = require('path')
const Fs = require('fs')
const hq = require('../../src')

/**
 * Returns information about a path relative to a root
 *
 * @param   {string}  rootUrl
 * @param   {string}  path
 */
function getPathInfo (rootUrl, path) {
  const absRoot = hq.config.rootUrl
  const absPath = Path.resolve(rootUrl, path)
  const relPath = Path.relative(rootUrl, absPath)
  const exists = Fs.existsSync(absPath)
  const folder = Path.basename(absPath)
  const valid = !Path.relative(absRoot, absPath).startsWith('..')

  if (valid) {
    path = relPath
  }

  if (path === '') {
    path = '.'
  }

  return {
    path,
    folder,
    relPath,
    absPath,
    exists,
    valid,
  }
}

/**
 * Grab paths from input
 *
 * @param   {string}    text
 * @param   {string}    rootUrl
 */
function getPathsInfo (text, rootUrl) {
  return parsePathsFromText(text)
    .map(path => getPathInfo(rootUrl, path))
}

/**
 * Convert a string of text containing folders to an array of folders
 *
 * Handles quotes, spaces, etc
 *
 * @param   {string}  text
 * @returns {string[]}
 */
function parsePathsFromText (text) {
  text = text.trim()
  const rx = /(["'])(.+?)\1|(\S+)/g
  let match
  let folders = []
  while (match = rx.exec(text)) {
    const folder = match[1] ? match[2] : match[0]
    folders.push(folder)
  }
  return folders
}

module.exports = {
  parsePathsFromText,
  getPathsInfo,
  getPathInfo,
}

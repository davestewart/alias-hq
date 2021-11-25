require('colors')
const Path = require('path')
const Fs = require('fs')
const hq = require('../../src')
const { isPathValid, getPathString, parsePathsFromText } = require('../utils/paths')
const { makePathsBullets } = require('../utils/text')

/**
 * Checks paths and returns useful data
 *
 * @param   {string}    text      The text to parse into paths
 * @param   {string}    rootUrl   The root URL to determine paths from
 * @param   {boolean}   exists    Whether the paths must exist
 * @returns {{infos: PathInfo[], valid: boolean, input: string}}
 */
function checkPaths (text, rootUrl = undefined, exists = true) {
  // check paths
  rootUrl = rootUrl || hq.config.rootUrl
  const infos = getPathsInfo(text, rootUrl)

  // info
  if (infos.length) {
    console.log()
    console.log(makePathsBullets(infos, exists))
    console.log()
  }

  // valid
  const clean = infos.filter(info => isPathValid(info, exists))

  // return
  return {
    infos,
    valid: (clean.length === infos.length) && infos.length !== 0,
    input: clean.map(info => getPathString(info.relPath)).join(' '),
  }
}

/**
 * Checks a single path and returns useful data
 *
 * @param   {string}    text      The text to parse into a path
 * @param   {string}    rootUrl   The root URL to determine the path from
 * @param   {boolean}   exists    Whether the path must exist
 * @returns {{info: PathInfo, valid: boolean, input: string}}
 */
function checkPath (text, rootUrl = undefined, exists = true) {
  // check paths
  rootUrl = rootUrl || hq.config.rootUrl
  const infos = getPathsInfo(text, rootUrl).slice(0, 1)

  // info
  if (infos.length) {
    console.log()
    console.log(makePathsBullets(infos, exists))
    console.log()
  }

  // valid
  const info = infos[0]
  const valid = isPathValid(info, exists)

  // return
  return {
    info,
    valid,
    input: valid ? getPathString(info.relPath) : '',
  }
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

module.exports = {
  cleanPathsInfo,
  getPathsInfo,
  getPathInfo,
  checkPaths,
  checkPath,
}

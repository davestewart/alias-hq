require('colors')
const hq = require('../src')
const { getPathsInfo, isPathValid, getPathString } = require('./utils/paths')
const { indent, makeBullet, makeJson, getLongestStringLength } = require('./utils/text')

/**
 * Make a single bullet item with icon, label and note
 *
 * @param   {string}    label
 * @param   {string}    note
 * @param   {boolean}   state
 * @param   {number}    width
 * @returns {string}
 */
function makeNoteBullet (label, note, state = undefined, width = 0) {
  const padding = ' '.repeat(Math.max(width - label.length, 0))
  const labelText = label.cyan
  const noteText = `- ${note}`.gray.italic
  return makeBullet(`${labelText} ${padding} ${noteText}`, state)
}

/**
 * Build a bulleted list of items with icon, label and note
 *
 * @param   {object}  item
 * @returns {*}
 */
function makeObjectBullets (item) {
  const keys = Object.keys(item)
  const width = getLongestStringLength(keys)

  return keys.map(key => {
    const label = key
    const note = item[key]
    return makeNoteBullet(label, note, undefined, width)
  }).join('\n')
}

/**
 * Build a bulleted list of items with icon, label and note
 *
 * @param   {object[]}  items
 * @param   {string}    labelProp
 * @param   {string}    noteProp
 * @returns {*}
 */
function makeItemsBullets (items, labelProp, noteProp) {
  const width = items.length
    ? getLongestStringLength(items, labelProp)
    : 0

  return items.map(item => {
    const label = item[labelProp] || ''
    const note = item[noteProp] || ''
    return makeNoteBullet(label, note, undefined, width)
  }).join('\n')
}

/**
 * Build a bulleted list of paths with icon, label and note
 *
 * @param   {PathInfo[]}    infos
 * @param   {boolean}      [exists]
 * @returns {string}
 */
function makePathsBullets (infos, exists = true) {
  const width = getLongestStringLength(infos, 'relPath')
  return infos
    .map(info => {
      const state = isPathValid(info, exists)
      return makeNoteBullet(info.folder, info.absPath, state, width)
    })
    .join('\n')
}

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
 * Log the current config to the terminal
 */
function showConfig () {
  hq.load()
  console.log()
  console.log(indent(makeJson(hq.config)))
}

module.exports = {
  showConfig,
  makeObjectBullets,
  makeItemsBullets,
  makePathsBullets,
  checkPaths,
  checkPath,
}

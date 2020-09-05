require('colors')
const Path = require('path')
const Fs = require('fs')
const hq = require('../../src')
const { getPathsInfo } = require('../utils/paths')
const { indent, makeBullet, makeJson, getLongestStringLength } = require('../utils/text')

function makePaths (folders, answers) {
  const { config } = hq
  const rootUrl = Path.resolve(config.rootUrl, answers.baseUrl)
  const paths = answers.action === 'add'
    ? config.paths
    : {}
  return folders.reduce((output, input) => {
    // path
    let path = Path.isAbsolute(input)
      ? Path.relative(rootUrl, input)
      : input

    // alias
    let alias = answers.prefix + Path.basename(path)

    // folder
    const ext = Path.extname(path)
    if (!ext) {
      path += '/*'
      alias += '/*'
    }

    // file
    else {
      alias = alias.replace(ext, '')
    }

    // assign
    output[alias] = [path]
    return output
  }, paths)
}

/**
 * @param   {object}    answers
 * @param   {boolean}   colorize
 * @returns {string}
 */
function makeConfig (answers, colorize = false) {
  // variables
  const baseUrl = answers.baseUrl

  // paths
  let paths = answers.paths
    .filter(info => info.valid)
    .map(info => info.relPath)

  // json
  paths = makePaths(paths, answers)

  // config
  const config = {
    compilerOptions: {
      baseUrl,
      paths
    }
  }

  // json
  return makeJson(config, answers, colorize, true)
}

function getNoteBullet (label, note, state = undefined, width = 0) {
  const padding = ' '.repeat(Math.max(width - label.length, 0))
  const labelText = label.cyan
  const noteText = `- ${note}`.gray.italic
  return makeBullet(`${labelText} ${padding} ${noteText}`, state)
}

function getPathsBullets (paths, prop = 'valid') {
  const width = getLongestStringLength(paths, 'relPath')
  return paths
    .map(config => {
      return getNoteBullet(config.relPath, config.absPath, config[prop], width)
    })
    .join('\n')
}

function getItemsBullets (items, labelProp, noteProp) {
  const width = items.length
    ? getLongestStringLength(items, labelProp)
    : 0

  return items.map(item => {
    const label = item[labelProp] || ''
    const note = item[noteProp] || ''
    return getNoteBullet(label, note, undefined, width)
  }).join('\n')
}

function checkPaths (text, rootUrl = undefined) {
  // check paths
  rootUrl = rootUrl || hq.config.rootUrl
  const paths = getPathsInfo(text, rootUrl)

  // info
  if (paths.length) {
    console.log()
    console.log(getPathsBullets(paths))
    console.log()
  }

  // return
  return paths
}

function checkPath (text, rootUrl = undefined) {
  // check paths
  rootUrl = rootUrl || hq.config.rootUrl
  const paths = getPathsInfo(text, rootUrl).slice(0, 1)

  // info
  if (paths.length) {
    console.log()
    console.log(getPathsBullets(paths))
    console.log()
  }

  // return
  return paths[0]
}

function showConfig () {
  hq.load()
  console.log()
  console.log(indent(makeJson(hq.config, true, true)) + '\n')
}

module.exports = {
  showConfig,
  makeConfig,
  getItemsBullets,
  getPathsBullets,
  checkPaths,
  checkPath,
}

const Path = require('path')
const Fs = require('fs')
const hq = require('../../../../src')
const { parsePathsFromText } = require('../../../utils')

/**
 * Returns information about a path which is used to present to the user
 *
 * @param   {string}  path
 * @param   {string}  rootUrl
 * @returns {{valid: (boolean|boolean), path: string, absPath: string, relPath: string}}
 */
function getPathInfo (path, rootUrl) {
  const absPath = Path.resolve(path)
  const relPath = Path.relative(rootUrl, absPath)
  const exists = Fs.existsSync(absPath)
  const valid = !relPath.startsWith('..')

  if (valid) {
    path = relPath
  }

  if (path === '') {
    path = '.'
  }

  return {
    path,
    relPath,
    absPath,
    valid: exists && valid,
  }
}

/**
 * Grab paths from input, sort and de-dupe
 *
 * @param   {string}  text
 * @param   {string}  rootUrl
 */
function getPathsInfo (text, rootUrl) {
  return parsePathsFromText(text)
    // get info
    .map(path => getPathInfo(path, rootUrl))

    // debug
    // .map(config => {
    //   console.log(config)
    //   return config
    // })

    // sort
    .sort(function (a, b) {
      return a.absPath < b.absPath
        ? -1
        : a.absPath > b.absPath
          ? 1
          : 0
    })

    // de-dupe / remove nested
    .reduce((output, input) => {
      if (input.valid) {
        if (!output.find(o => input.absPath.startsWith(o.absPath))) {
          output.push(input)
        }
      }
      return output
    }, [])
}

/**
 * Transform basic aliases info into something more useful
 */
function getAliases () {
  const rootUrl = hq.config.rootUrl
  const lookup = hq.get('lookup').map(item => {
    return {
      alias: item.alias,
      path: item.path,
      folder: Path.relative(rootUrl, item.path),
    }
  })
  const names = lookup.map(path => path.alias)
  return {
    lookup,
    names,
    get (alias) {
      return lookup.find(item => item.alias === alias)
    },
    getName (path) {
      return lookup.find(item => item.path === path).alias
    },
    getPath (alias) {
      return lookup.find(item => item.alias === alias).path
    }
  }
}

module.exports = {
  getPathsInfo,
  getAliases,
}

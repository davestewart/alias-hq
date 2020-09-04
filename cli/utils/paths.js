const Path = require('path')
const Fs = require('fs')

/**
 * Returns information about a path which is used to present to the user
 *
 * @param   {string}  path
 * @param   {string}  rootUrl
 */
function getPathInfo (path, rootUrl) {
  const absPath = Path.resolve(rootUrl, path)
  const relPath = Path.relative(rootUrl, absPath)
  const exists = Fs.existsSync(absPath)
  const folder = Path.basename(absPath)
  const valid = !relPath.startsWith('..')

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
 * Grab paths from input, sort and de-dupe
 *
 * @param   {string}    text
 * @param   {string}    rootUrl
 * @param   {boolean}   removeNested
 */
function getPathsInfo (text, rootUrl, removeNested = true) {
  const paths = parsePathsFromText(text)
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

  // optionally remove invalid
  //.filter(input => all || (input.valid && input.exists))

  // return
  return !removeNested
    ? paths
    : paths.reduce((output, input) => {
      if (!output.find(o => input.absPath.startsWith(o.absPath))) {
        output.push(input)
      }
      return output
    }, [])

}

/**
 * Convert a string of text containing folders to an array of folders
 *
 * Handles quotes, spaces, etc
 *
 * @param input
 * @returns {[]}
 */
function parsePathsFromText (input) {
  const rx = /(["'])(.+?)\1|(\S+)/g
  let match
  let folders = []
  while (match = rx.exec(input)) {
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

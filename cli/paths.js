const Path = require('path')

function makeSettings (config) {
  const { rootUrl, baseUrl, paths } = config
  return {
    rootUrl,
    baseUrl,
    paths,
    type: 'new',
    prefix: '@',
  }
}

function getFolders (input) {
  const rx = /(["'])(.+?)\1|(\S+)/g
  let match
  let folders = []
  while(match = rx.exec(input)) {
    const folder = match[1] ? match[2] : match[0]
    folders.push(folder)
  }
  return folders
}

function makePaths (folders, settings) {
  const rootUrl = Path.resolve(settings.rootUrl, settings.baseUrl)
  const paths = settings.type === 'all'
    ? settings.paths
    : {}
  return folders.reduce((output, input) => {
    // path
    let path = Path.isAbsolute(input)
      ? Path.relative(rootUrl, input)
      : input

    // alias
    let alias = settings.prefix + Path.basename(path)

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
    output[alias] = [ path ]
    return output
  }, paths)
}

function makeJson (paths, settings) {
  const config = {
    compilerOptions: {
      baseUrl: settings.baseUrl,
      paths
    }
  }
  return JSON
    .stringify(config, null, '  ')
    .replace(/\[\s+/g, '[')
    .replace(/\s+\]/g, ']')
}

module.exports = {
  makeSettings,
  getFolders,
  makePaths,
  makeJson,
}

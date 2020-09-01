const inquirer = require('inquirer')
const Path = require('path')
const hq = require('../../src')
const { parsePathsFromText } = require('../utils')

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

function run () {
  const settings = makeSettings(hq.config)
  return Promise.resolve()
    .then(() => {
      return inquirer
        .prompt({
          type: 'list',
          name: 'type',
          message: 'Generate:',
          choices: [
            '- new aliases',
            '- all aliases',
          ],
        })
    })
    .then((answer) => {
      settings.type = answer.type.match(/\w+/).toString()
      return inquirer
        .prompt({
          type: 'input',
          name: 'baseUrl',
          message: 'Base URL:',
          default: settings.baseUrl
        })
    })
    .then((answer) => {
      settings.baseUrl = answer.baseUrl
      return inquirer
        .prompt({
          type: 'input',
          name: 'prefix',
          message: 'Alias prefix:',
          default: settings.prefix
        })
    })
    .then((answer) => {
      settings.prefix = answer.prefix
      return inquirer
        .prompt({
          type: 'input',
          name: 'text',
          message: 'Folders (drag here, or type paths):',
        })
    })
    .then((answer) => {
      const folders = parsePathsFromText(answer.text)
      const paths = makePaths(folders, settings)
      const json = makeJson(paths, settings)
      console.log('\n' + json + '\n')
    })
}


module.exports = {
  makeSettings,
  makePaths,
  makeJson,
  run,
}

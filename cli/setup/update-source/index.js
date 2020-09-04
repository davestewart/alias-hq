require('colors')
const Path = require('path')
const inquirer = require('inquirer')
const runner = require('jscodeshift/src/Runner')
const hq = require('../../../src')
const cliTransform = require('../../plugin')
const { getLongestStringLength } = require('../../utils/text')
const { numAliases, loadSettings, saveSettings } = require('../../utils/config')
const { getPathsInfo } = require('../../utils/paths')
const { makeBullet, para } = require('../../utils/text')
const { makeChoices } = require('../../utils/inquirer')
const assert = require('assert').strict

// ---------------------------------------------------------------------------------------------------------------------
// actions
// ---------------------------------------------------------------------------------------------------------------------

const actions = {
  getPaths () {
    const defaults = hq.settings.folders.length
      ? hq.settings.folders.map(folder => {
        return folder.includes(' ')
          ? `'${folder}'`
          : folder
      }).join(' ')
      : hq.config.baseUrl
    return inquirer
      .prompt({
        type: 'input',
        name: 'paths',
        message: 'Paths:',
        default: defaults
      })
      .then(answer => {
        answers.paths = getPathsInfo(answer.paths, rootUrl)
      })
  },

  getModules () {
    const maxLength = getLongestStringLength(aliases.names)
    const choices = aliases.lookup
      .reverse()
      .map(({ alias, folder }) => {
        const label = alias + ' '.repeat(maxLength - alias.length)
        const name = label + '  ' + `- ${folder}`.grey
        return {
          name,
          short: alias
        }
      })
    const defaults = hq.settings.modules
      .map(folder => {
        return choices.find(choice => choice.name.startsWith(folder + ' ')).name
      })
    return inquirer
      .prompt({
        type: 'checkbox',
        name: 'modules',
        message: `Module roots:`,
        choices: choices,
        default: defaults,
      })
      .then(answer => {
        answers.modules = answer.modules
          .map(answer => answer.match(/\S+/).toString())
          .map(alias => aliases.get(alias))
      })
  },

  getExtensions () {
    return inquirer
      .prompt({
        type: 'input',
        name: 'extensions',
        message: 'Extensions:',
        default: hq.settings.language === 'ts'
          ? 'ts js tsx jsx'
          : 'js jsx',
      })
      .then(answer => {
        answers.extensions = (answer.extensions
          .match(/\w+/g) || [])
          .join(' ')
      })
  },

  confirmChoices () {
    function log (title, answers) {
      if (!Array.isArray(answers)) {
        answers = [answers]
      }
      answers = answers
        .map(answer => answer.cyan)
        .map(answer => makeBullet(answer))
      console.log(`  ${title}:\n${answers.join('\n')}`)
    }

    function getPaths (paths) {
      const width = paths.length
        ? getLongestStringLength(paths, 'path')
        : 0

      return paths.map(config => {
        const { path, absPath, valid } = config

        const label = path.cyan
        const padding = ' '.repeat(width - path.length)
        const info = `- ${absPath}`.gray.italic

        return makeBullet(`${label} ${padding} ${info}`, valid)
      }).join('\n')
    }

    function getModules (modules) {
      const width = modules.length
        ? getLongestStringLength(modules, 'alias')
        : 0

      return modules.map(config => {
        const { alias, folder, path } = config

        const label = alias.cyan
        const padding = ' '.repeat(width - alias.length)
        const info = `- ${folder}`.gray.italic

        return makeBullet(`${label} ${padding} ${info}`)
      }).join('\n')
    }

    // inspect(answers)

    console.log('')
    console.log(`  ${'Paths'}:\n` + getPaths(answers.paths))
    if (answers.modules.length) {
      console.log(`  ${'Module roots'}:\n` + getModules(answers.modules))
    }
    log('Extensions', answers.extensions)
    console.log()
  },

  saveOptions () {
    const oldSettings = {
      // extensions: hq.settings.extensions,
      folders: hq.settings.folders,
      modules: hq.settings.modules,
    }
    const newSettings = {
      // extensions: answers.extensions,
      folders: answers.paths.map(path => path.relPath),
      modules: answers.modules.map(alias => alias.alias),
    }
    // inspect({oldSettings, newSettings})

    try {
      assert.deepEqual(oldSettings, newSettings)
    } catch (err) {
      return inquirer
        .prompt({
          type: 'confirm',
          name: 'save',
          message: 'Save updated choices?',
          default: false,
        })
        .then(answer => {
          if (answer.save) {
            saveSettings(newSettings)
          }
        })
    }
  },

  process () {
    const choices = {
      preview: 'Preview updates',
      change: 'Make changes',
      proceed: 'Update source code ' + '- no further confirmation!'.red,
      cancel: 'Cancel',
    }
    return inquirer
      .prompt({
        type: 'list',
        name: 'action',
        message: `Next step:`,
        choices: makeChoices(choices),
        default: choices.preview,
      })
      .then(answer => {
        const action = answer.action
        if (action === choices.cancel) {
          return
        }

        if (action === choices.change) {
          return updateSource()
        }

        // paths
        const paths = answers.paths
          .filter(config => config.valid)
          .map(config => config.absPath)

        // const paths = 'demo/src src demo/packages'.split(' ')

        // modules
        const modules = answers.modules
          .map(module => module.alias)

        // options
        const options = {
          silent: true,
          verbose: 0,
          runInBand: true,
          extensions: answers.extensions.replace(/ /g, ', '),
          dry: action === choices.preview,
        }

        // debug
        // inspect({ paths, options, aliases, modules })

        // do it
        if (aliases.names.length) {
          console.log()
          const file = __dirname + '/transformer.js'
          return runner
            .run(file, paths, { ...options, aliases, modules })
            .then(results => {
              console.log()
              // inspect(results)

              // results
              console.log(`Results: in ${results.timeElapsed} seconds\n`)
              console.log('  › ' + `updated    : ${results.ok}`.green)
              console.log('  › ' + `unmodified : ${results.nochange}`.yellow)
              console.log('  › ' + `skipped    : ${results.skip}`.grey)
              console.log('  › ' + `errors     : ${results.error}`.red)
              console.log()

              // run again
              return actions.process()
            })
        }
      })
  },
}

// ---------------------------------------------------------------------------------------------------------------------
// setup
// ---------------------------------------------------------------------------------------------------------------------

function getAliases () {
  const rootUrl = hq.config.rootUrl
  const lookup = hq.get(cliTransform).map(item => {
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

function getAnswers () {
  return  {
    extensions: '',
    paths: [],
    modules: [],
  }
}

// config
const rootUrl = hq.config.rootUrl
let aliases = getAliases()
let answers = getAnswers()

// main function
function updateSource () {
  // setup
  hq.load()
  aliases = getAliases()
  answers = getAnswers()

  // check
  if (!numAliases()) {
    para('No aliases configured: skipping source code update!'.red)
    return
  }

  // actions
  return Promise.resolve()
    .then(actions.getPaths)
    .then(actions.getModules)
    .then(actions.getExtensions)
    .then(actions.confirmChoices)
    .then(actions.saveOptions)
    .then(actions.process)
}

module.exports = {
  updateSource,
  getAliases,
}

const colors = require('colors')
const inquirer = require('inquirer')
const runner = require('../../../node_modules/jscodeshift/src/Runner')
const { inspect } = require('../../../src/utils')
const hq = require('../../../src')
const { getLongestStringLength } = require('../../utils')
const { getPathsInfo, getAliases } = require('./utils/setup')

function run () {
  hq.load()

  // config
  const rootUrl = hq.config.rootUrl
  const aliases = getAliases()
  const answers = {
    paths: [],
    modules: [],
    extensions: '',
    dry: false,
  }

  // warning
  console.log('\n [ WARNING ] : THIS OPERATION WILL OVERWRITE FILES'.yellow)
  console.log('               Make sure your source code is committed so you can roll back!\n'.yellow)

  // paths
  return Promise.resolve()

    // paths
    .then(() => {
      return inquirer
        .prompt({
          type: 'input',
          name: 'paths',
          message: 'Paths:',
          default: hq.config.baseUrl
        })
        .then(answer => getPathsInfo(answer.paths, rootUrl))
        .then(folders => {
          answers.paths = folders
        })
    })

    // module roots
    .then(() => {
      if (aliases.lookup.length) {
        const maxLength = getLongestStringLength(aliases.names)
        const choices = aliases.lookup.map(({ alias, folder }) => {
          const label = alias + ' '.repeat(maxLength - alias.length)
          return label + '  ' + `- ${folder}`.grey
        })
        return inquirer
          .prompt({
            type: 'checkbox',
            name: 'modules',
            message: `Module roots:`,
            choices: choices,
          })
          .then(answer => {
            answers.modules = answer.modules
              .map(answer => answer.match(/\S+/).toString())
              .map(alias => aliases.get(alias))
          })
      }
    })

    // extensions
    .then(() => {
      return inquirer
        .prompt({
          type: 'input',
          name: 'extensions',
          message: 'Extensions:',
          default: 'js ts',
        })
        .then(answer => {
          answers.extensions = answer.extensions
            .match(/\w+/g) || []
        })
    })

    // dry run
    .then(() => {
      return inquirer
        .prompt({
          type: 'confirm',
          name: 'dry',
          message: 'Dry run?',
        })
        .then(answer => {
          answers.dry = answer.dry
        })
    })

    // confirm
    .then(() => {
      function line (text, state) {
        const bullet = typeof state === 'undefined'
          ? '›'
          : state
            ? '✔'.green
            : '✘'.red
        return `    ${bullet} ${text}`
      }

      function log (title, answers) {
        if (!Array.isArray(answers)) {
          answers = [answers]
        }
        answers = answers
          .map(answer => answer.cyan)
          .map(answer => line(answer))
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

          return line(`${label} ${padding} ${info}`, valid)
        })
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

          return line(`${label} ${padding} ${info}`)
        })
      }

      // inspect(answers)

      console.log('')
      console.log(`  ${'Paths'}:\n` + getPaths(answers.paths).join('\n'))
      if (answers.modules.length) {
        console.log(`  ${'Module roots'}:\n` + getModules(answers.modules).join('\n'))
      }
      log('Extensions', answers.extensions)
      log('Dry run', answers.dry ? 'Yes' : 'No')
      console.log()

      return inquirer
        .prompt({
          type: 'confirm',
          name: 'confirm',
          message: answers.dry
            ? 'Preview changes now?'
            : 'Update source code now?'.red,
        })
    })

    // process
    .then(answer => {
      if (!answer.confirm) {
        return
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
        verbose: 0,
        extensions: answers.extensions.join(', '),
        dry: answers.dry,
      }

      // debug
      // inspect({ paths, options, aliases, modules })

      // do it
      if (aliases.names.length) {
        const file = __dirname + '/transformers/ast.js'
        return runner.run(file, paths, { ...options, aliases, modules })
      }
    })
}

module.exports = {
  run
}


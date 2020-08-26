'use strict'

const Path = require('path')
const inquirer = require('inquirer')
const hq = require('..')

function showConfig () {
  hq.load()
  console.log(hq.config)
}

function listPlugins () {
  hq.plugins.names.forEach(format => {
    console.log({ format, aliases: hq.get(format) })
  })
}

function dumpJson () {
  inquirer
    .prompt({
      type: 'list',
      name: 'format',
      message: 'In what format?',
      choices: hq.plugins.names.map(name => '- ' + name),
    })
    .then((answer) => {
      const choice = answer.format.match(/\w+/).shift()
      hq.json(choice)
    })
}

function makeJson () {
  // load config
  hq.load()
  const { rootUrl, baseUrl } = hq.config
  const settings = {
    rootUrl: Path.resolve(rootUrl, baseUrl),
    paths: hq.config.paths,
    type: 'all',
    prefix: '@',
  }


  // get info
  Promise.resolve()
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
          default: baseUrl
        })
    })
    .then((answer) => {
      settings.rootUrl = Path.resolve(rootUrl, answer.baseUrl)
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
          message: 'Folders (drag here):',
        })
    })
    .then((answer) => {
      // parse input
      const input = answer.text
      const rx = /"[^"]+"|\S+/g
      let folder
      let folders = []
      while (folder = rx.exec(input)) {
        folders.push(folder[0])
      }

      // create output
      const paths = folders.reduce((output, input) => {
        const absPath = Path.resolve(input)
        const relPath = Path.relative(settings.rootUrl, absPath)
        const alias = settings.prefix + Path.basename(absPath) + '/*'
        output[alias] = [ relPath + '/*' ]
        return output
      }, settings.type === 'all' ? settings.paths : {})

      // build
      const config = {
        compilerOptions: {
          baseUrl: hq.config.baseUrl,
          paths: paths
        }
      }

      // log
      const json = JSON
        .stringify(config, null, '  ')
        .replace(/\[\s+/g, '[')
        .replace(/\s+\]/g, ']')
      console.log('\n' + json + '\n')
    })

}

function main () {
  console.log('\n  == Alias HQ ==')
  inquirer
    .prompt({
      type: 'list',
      name: 'choice',
      message: 'What do you want to do?',
      choices: [
        '- Show loaded config',
        '- List plugins output (JS)',
        '- Dump plugin output (JSON)',
        '- Make paths JSON',
      ],
    })
    .then((answer) => {
      const choice = answer.choice.match(/\w+/).shift()
      switch (choice) {
        case 'Show':
          showConfig()
          break

        case 'List':
          listPlugins()
          break

        case 'Dump':
          dumpJson()
          break

        case 'Make':
          makeJson()
          break
      }
    })
}

main()

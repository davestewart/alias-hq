const inquirer = require('inquirer')
const hq = require('..')
const Paths = require('./paths')

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
  hq.load()
  const settings = Paths.makeSettings(hq.config)
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
      const folders = Paths.getFolders(answer.text)
      const paths = Paths.makePaths(folders, settings)
      const json = Paths.makeJson(paths, settings)
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

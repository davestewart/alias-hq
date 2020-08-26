'use strict'

const hq = require('..')
const inquirer = require('inquirer')

function main () {
  console.log('\n  == Alias HQ ==')
  inquirer
    .prompt({
      type: 'list',
      name: 'choice',
      message: 'What do you want to do?',
      choices: [
        'Show loaded config',
        'List plugin names',
        'Dump paths as json',
      ],
    })
    .then((answer) => {
      const choice = answer.choice.match(/\w+/).shift()
      switch (choice) {
        case 'Show':
          hq.load()
          console.log(hq.config)
          break

        case 'List':
          console.log(' - ' + hq.plugins.names.join('\n - '))
          break

        case 'Dump':
          inquirer
            .prompt({
              type: 'list',
              name: 'format',
              message: 'In what format?',
              choices: hq.plugins.names,
            })
            .then((answer) => {
              const choice = answer.format.match(/\w+/).shift()
              hq.log(choice)
            })
          break
      }
    })
}

main()
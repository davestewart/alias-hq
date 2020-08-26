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
        '- Show loaded config',
        '- List plugin output',
        '- Dump paths as json',
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
          hq.plugins.names.forEach(format => {
            console.log({ format, aliases: hq.get(format) })
          })
          break

        case 'Dump':
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
          break
      }
    })
}

main()
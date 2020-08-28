const inquirer = require('inquirer')

// modules
const Plugins = require('./modules/list-plugins')
const Config = require('./modules/show-config')
const Paths = require('./modules/make-paths')
const Json = require('./modules/dump-json')

let previousChoice

function main () {
  console.log('\n  == Alias HQ ==')
  inquirer
    .prompt({
      type: 'list',
      name: 'choice',
      message: 'What do you want to do?',
      default: previousChoice,
      choices: [
        '- Show loaded config',
        '- List plugins output (JS)',
        '- Dump plugin output (JSON)',
        '- Make paths JSON',
      ],
    })
    .then((answer) => {
      previousChoice = answer.choice
      const choice = answer.choice.match(/\w+/).shift()
      let result
      switch (choice) {
        case 'Show':
          result = Config.run()
          break

        case 'List':
          result = Plugins.run()
          break

        case 'Dump':
          result = Json.run()
          break

        case 'Make':
          result = Paths.run()
          break
      }

      // run again...
      Promise
        .resolve(result)
        .then(main)
    })
}

main()

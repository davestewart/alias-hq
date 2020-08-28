const inquirer = require('inquirer')
const inspect = require('../../src/utils/dev').inspect
const hq = require('../../src')
const { getPlugins } = require('../utils')

function run () {
  // variables
  const plugins = getPlugins()

  // choices
  return inquirer
    .prompt({
      type: 'list',
      name: 'name',
      message: 'Which plugin?',
      choices: Object.keys(plugins).map(plugin => '- ' + plugin),
    })
    .then((answer) => {
      // plugin
      const name = answer.name.substr(2)
      const plugin = plugins[name]

      // no options
      const formats = Object.keys(plugin)
      if (formats.length === 0) {
        return hq.json(name)
      }

      // options
      else {
        return inquirer
          .prompt({
            type: 'list',
            name: 'label',
            message: 'Which format?',
            choices: formats.map(format => '- ' + format),
          })
          .then((answer) => {
            const label = answer.label.substr(2)
            hq.json(name, plugin[label])
          })
      }
    })
}

module.exports = {
  run
}

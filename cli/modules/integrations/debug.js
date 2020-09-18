const inquirer = require('inquirer')
const hq = require('../../../src')
const { getPlugins } = require('../../services/config')
const { indent, makeJson } = require('../../utils/text')

// ---------------------------------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------------------------------

function printConfig (data) {
  console.log()
  const text = data === true
    ? 'This plugin does not generate any output'.red
    : makeJson(data)

  console.log(indent(text))
}

// ---------------------------------------------------------------------------------------------------------------------
// actions
// ---------------------------------------------------------------------------------------------------------------------

const actions = {
  getPlugin () {
    const plugins = settings.plugins
    const choices = Object.keys(plugins)
      .map(value => {
        const short = value.replace(/\w/, c => c.toUpperCase())
        return {
          name: '- ' + short,
          short,
          value,
        }
      })

    return inquirer
      .prompt({
        type: 'list',
        name: 'name',
        message: 'Which integration?',
        default: previous.name,
        choices
      })
      .then((answer) => {
        previous.name = answer.name
        answers.name = answer.name
      })
  },

  getFormat () {
    // options
    const name = answers.name
    const plugin = settings.plugins[name]
    const formats = Object.keys(plugin)
    const choices = formats.map(value => {
      const short = value.replace(/\w/, c => c.toUpperCase())
      return {
        name: '- ' + short,
        short,
        value
      }
    })

    // no options
    if (formats.length === 1) {
      return printConfig(hq.get(name))
    }

    // got formats
    return inquirer
      .prompt({
        type: 'list',
        name: 'format',
        message: 'Which format?',
        default: previous.format,
        choices,
      })
      .then((answer) => {
        previous.format = answer.format
        const format = answer.format
        return printConfig(hq.get(name, plugin[format]))
      })
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// setup
// ---------------------------------------------------------------------------------------------------------------------

const previous = {}
const settings = {
  plugins: []
}
const answers = {
  plugin: '',
  format: ''
}

function debugConfiguration () {
  settings.plugins = getPlugins()
  return Promise.resolve()
    .then(actions.getPlugin)
    .then(actions.getFormat)
}

module.exports = {
  debugConfiguration
}

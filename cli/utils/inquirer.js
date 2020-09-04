const inquirer = require('inquirer')
const inspect = require('../../src/utils').inspect

function makeChoice (key, label) {
  const text = label || key
  const name = '- ' + text
  return {
    name,
    value: { key, label, name },
  }
}

/**
 * Utility function for better inquirer choices
 */
function makeChoices (choices) {
  return Object
    .keys(choices)
    .map(key => {
      let value = choices[key]
      return {
        name: value
          ? '- ' + value
          : new inquirer.Separator(' '),
        short: value.replace(/\s+-.+/, ''),
        value,
      }
    })
}

function makeMenuHeader (text) {
  // text = ` ${text} `
  const underline = '='.repeat(text.length)
  return `${text.cyan}\n\n  What do you want to do?`
}

module.exports = {
  makeMenuHeader,
  makeChoices,
  inspect,
}

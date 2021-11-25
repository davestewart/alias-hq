const inquirer = require('inquirer')

function makeChoice (text = '', value = undefined) {
  if (!text || text.startsWith('  ')) {
    text = text || '  ----'
    return new inquirer.Separator(text.grey)
  }
  return {
    name: '- ' + text,
    short: text.replace(/\s+-.+/, ''),
    value: value || text,
  }
}

/**
 * Utility function for better inquirer choices
 */
function makeChoices (choices, valueAsKey = false) {
  return Object
    .keys(choices)
    .map(key => makeChoice(choices[key], valueAsKey ? key : undefined))
}

function getAnswer (choices, text) {
  const choice = Object
    .entries(choices)
    .find(entry => entry[1] === text)
  return choice
    ? choice[0]
    : undefined
}

module.exports = {
  makeChoices,
  makeChoice,
  getAnswer,
}

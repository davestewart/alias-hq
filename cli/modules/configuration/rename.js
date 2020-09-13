require('colors')
const inquirer = require('inquirer')
const hq = require('../../../src')
const { getLongestStringLength, makeBullet } = require('../../utils/text')
const { makeChoices } = require('../../utils/prompts')

// ---------------------------------------------------------------------------------------------------------------------
// actions
// ---------------------------------------------------------------------------------------------------------------------

const actions = {
  getFrom () {
    return inquirer
      .prompt({
        type: 'input',
        name: 'from',
        message: 'From:',
        default: previous.from
      })
      .then(answer => {
        const from = answer.from.trim()
        if (!from) {
          return actions.getFrom()
        }
        try {
          previous.from = from
          answers.from = from
        }
        catch (err) {
          console.log('Error:', err.message)
          return actions.getFrom()
        }
      })
  },

  getTo () {
    return inquirer
      .prompt({
        type: 'input',
        name: 'to',
        message: 'To:',
        default: previous.to
      })
      .then(answer => {
        const to = answer.to.trim()
        previous.to = to
        answers.to = to
      })
  },

  getFlags () {
    return inquirer
      .prompt({
        type: 'input',
        name: 'flags',
        message: 'Flags:',
        default: previous.flags
      })
      .then(answer => {
        const flags = answer.flags.trim()
        previous.flags = flags
        answers.flags = flags
      })
  },


  preview () {
    // function
    const rx = new RegExp(answers.from, answers.flags)
    const replace = answers.replace = function (path) {
      return path.replace(rx, answers.to).replace(/\/+/, '/')
    }

    // path
    const keys = Object.keys(hq.config.paths)
    const maxLength = getLongestStringLength(keys)

    // before
    console.log('')
    console.log('Preview:')
    console.log('')

    // output
    keys.forEach(key => {
      const path = key.slice(0, -2)
      const left = path + ' '.repeat(maxLength - path.length)
      const right = replace(path)
      const replaced = path !== right
      const cols = replaced
        ? [left.cyan, right.cyan]
        : [left.grey, right.grey]
      const text = cols.join('–>  '.grey)
      console.log(makeBullet(text, replaced))
    })

    // after
    console.log()
  },

  confirm () {
    const choices = {
      rename: 'Update config',
      udpate: 'Update source code',
    }
    return inquirer
      .prompt({
        type: 'checkbox',
        name: 'action',
        message: `Actions:`.red,
        choices: makeChoices(choices)
      })
      .then((answer) => {
        if (!answer.action) {
          return
        }
      })
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// setup
// ---------------------------------------------------------------------------------------------------------------------

const previous = {}
const answers = {
  from: '',
  to: '',
  replace: '',
}

function renameAliases () {
  hq.load()
  return Promise.resolve()
    .then(actions.getFrom)
    .then(actions.getTo)
    .then(actions.getFlags)
    .then(actions.preview)
    .then(actions.confirm)
}

module.exports = {
  renameAliases,
}

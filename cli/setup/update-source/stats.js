/**
 * Reset all totals
 */
function reset () {
  current.updated = []
  current.skipped = []
  totals.updated = 0
  totals.skipped = 0
  totals.total = 0
}

/**
 * Log each individual replacement
 *
 * @param   {string}  from
 * @param   {string}  to
 */
function log (from, to) {
  if (to) {
    current.updated.push({ from, to })
  }
  else {
    current.skipped.push({ from, to })
  }
}

/**
 * Log output to terminal
 *
 * For some reason, logs seem to be asynchronous so we need to log all at once
 *
 * @param   {string}  path
 * @return  {boolean}
 */
function dump (path) {
  // title
  const title = current.updated.length
    ? path.cyan
    : path.grey
  let text = `\n${ title }\n\n`

  // items
  const skipped = current.skipped.map(item => {
    return `  › ` + item.from.grey
  })

  const updated = current.updated.map(item => {
    const { from, to } = item
    return `  › ${from}\n  › ${(to || '').cyan}` + '\n'
  })

  // text
  if (skipped.length) {
    text += skipped.join('\n') + '\n'
  }
  if (updated.length) {
    if (skipped.length) {
      text += '\n'
    }
    text += updated.join('\n')
  }

  // stats
  totals.updated += updated.length
  totals.skipped += skipped.length
  totals.total += updated.length + skipped.length

  // console
  console.log(text.replace(/\n$/, ''))

  // return
  const didUpdate = !!(updated.length || skipped.length)
  current.updated = []
  current.skipped = []
  return didUpdate
}

function present (results) {
  console.log()
  console.log('\n--------------------------------------------------------')
  console.log(`- ${'Stats'.red} `)
  console.log('--------------------------------------------------------')
  console.log(`\n  Lines:\n`)
  console.log('    › ' + `Total      : ${totals.total}`.blue)
  console.log('    › ' + `Updated    : ${totals.updated}`.cyan)
  console.log('    › ' + `Skipped    : ${totals.skipped}`.grey)
  console.log(`\n  Files:\n`)
  console.log('    › ' + `Updated    : ${results.ok}`.cyan)
  console.log('    › ' + `Unmodified : ${results.nochange}`.grey)
  console.log('    › ' + `Skipped    : ${results.skip}`.grey)
  console.log('    › ' + `Errors     : ${results.error}`.red)
  console.log(`\n  Time:\n`)
  console.log('    › ' + `Seconds    : ${results.timeElapsed}`)
  console.log('')
  console.log('--------------------------------------------------------\n\n')
}

// data
const current = {
  updated: [],
  skipped: [],
}
const totals = {
  updated: 0,
  skipped: 0,
  total: 0,
}

// export
module.exports = {
  reset,
  log,
  dump,
  present,
}

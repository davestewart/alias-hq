require('colors')

/**
 * Utility function to get the max length of a series of strings
 *
 * @param {array<string|object>}  items   An array or strings or objects
 * @param {string}               [prop]   An optional sub-property to grab
 * @returns {number}
 */
function getLongestStringLength (items, prop) {
  function getStringLength (item, prop) {
    const value = prop
      ? item[prop]
      : item
    return String(value || '').length
  }
  if (items && items.length > 0) {
    return items.length > 1
      ? Math.max(...items.map(item => getStringLength(item, prop)))
      : getStringLength(items[0], prop)
  }
  return 0
}

function makeColumns (rows, maxLength = 0) {
  const col1 = rows.map(row => row[0])
  const col2 = rows.map(row => row[1])
  maxLength = maxLength || getLongestStringLength(col1)
  return col1.map((text, index) => {
    const label = text + ' '.repeat(maxLength - text.length)
    return label + '  ' + `- ${col2[index]}`.grey
  })
}

function makeHeader (text) {
  console.log(`\n  -- ${text.cyan} --\n`)
}

function plural (num, single, plural = single + 's') {
  const word = num === 1 ? single : plural
  return `${num} ${word}`
}

function indent (text, indent = 4) {
  const padding = ' '.repeat(indent)
  return text.replace(/^/gm, padding)
}

function para (input, width = 60, indent = 2) {
  // variables
  const linebreak = '\n' + ' '.repeat(indent)
  const rx = /\S+\s*/g
  let output = ''
  let line = ''
  let word

  // process
  while (word = rx.exec(input)) {
    line += word
    if (line.length > width) {
      output += linebreak + line
      line = ''
    }
  }
  output += linebreak + line

  // log
  console.log(output)
}

const bullets = {
  item: '›',
  tick: '✔'.green,
  cross: '✘'.red,
}

function makeBullet (text, state) {
  const bullet = typeof state === 'undefined'
    ? bullets.item
    : state
      ? bullets.tick
      : bullets.cross
  return `    ${bullet} ${text}`
}

function makeFileBullet (info, state) {
  const { relPath, absPath } = info
  const relText = relPath.cyan
  const absText = `- ${absPath}`.gray.italic
  return makeBullet(`${relText} ${absText}`, state)
}

function makeJson (data, colorize = false, compact = false) {
  let json = JSON
    .stringify(data, null, 2)
  if (compact) {
    json = json
      .replace(/\[([\s\S]+?)\]/g, function (text) {
        const elements = text.match(/".+?"/g)
        return elements.length === 1
          ? `[ ${ elements[0] } ]`
          : text
      })
  }
  return colorize
    ? json.replace(/"(.+?)"/g, (matches, text) => `"${text.cyan}"`)
    : json + '\n'
}

module.exports = {
  getLongestStringLength,
  makeFileBullet,
  makeColumns,
  makeHeader,
  makeBullet,
  makeJson,
  bullets,
  indent,
  plural,
  para,
}

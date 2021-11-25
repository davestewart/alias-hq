require('colors')
const { isObject } = require('./index')
const { isPathValid } = require('./paths')

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
  // eslint-disable-next-line no-cond-assign
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

/**
 * Make a single bullet item with icon, label and note
 *
 * @param   {string}    label
 * @param   {string}    note
 * @param   {boolean}   state
 * @param   {number}    width
 * @returns {string}
 */
function makeNoteBullet (label, note, state = undefined, width = 0) {
  const padding = ' '.repeat(Math.max(width - label.length, 0))
  const labelText = label.cyan
  const noteText = `- ${note}`.gray.italic
  return makeBullet(`${labelText} ${padding} ${noteText}`, state)
}

/**
 * Build a bulleted list of items with icon, label and note
 *
 * @param   {object}  item
 * @returns {*}
 */
function makeObjectBullets (item) {
  const keys = Object.keys(item)
  const width = getLongestStringLength(keys)

  return keys.map(key => {
    const label = key
    const note = item[key]
    return makeNoteBullet(label, note, undefined, width)
  }).join('\n')
}

/**
 * Build a bulleted list of items with icon, label and note
 *
 * @param   {object[]}  items
 * @param   {string}    labelProp
 * @param   {string}    noteProp
 * @returns {*}
 */
function makeItemsBullets (items, labelProp, noteProp) {
  const width = items.length
    ? getLongestStringLength(items, labelProp)
    : 0

  return items.map(item => {
    const label = item[labelProp] || ''
    const note = item[noteProp] || ''
    return makeNoteBullet(label, note, undefined, width)
  }).join('\n')
}

/**
 * Build a bulleted list of paths with icon, label and note
 *
 * @param   {PathInfo[]}    infos
 * @param   {boolean}      [exists]
 * @returns {string}
 */
function makePathsBullets (infos, exists = true) {
  const width = getLongestStringLength(infos, 'relPath')
  return infos
    .map(info => {
      const state = isPathValid(info, exists)
      return makeNoteBullet(info.folder, info.absPath, state, width)
    })
    .join('\n')
}

/**
 * Make JSON to save to disk
 *
 * @param   {object}                data    The data to convert to JSON
 * @param   {JsonFormat|boolean}   options  An optional options object, or false to skip formatting
 * @return  {string}
 */
function makeJson (data, options = {}) {
  /**
   * @typedef    {object}     JsonFormat  Options to format JSON
   * @property   {boolean}   [compact]    Compact single arrays into one line
   * @property   {boolean}   [padding]    Pad any compacted single arrays with spaces
   * @property   {string}    [color]      Colorize any text in quotes
   */
  const defaults = {
    compact: true,
    padding: true,
    color: 'cyan',
  }

  // options
  options = isObject(options)
    ? { ...defaults, ...options }
    : { compact: true }

  // convert
  let json = JSON.stringify(data, null, 2)

  // compact
  if (options.compact) {
    json = compactJson(json, options.padding)
  }

  // color
  if (options.color) {
    json = json.replace(/"(.+?)"/g, (matches, text) => `"${text[options.color]}"`)
  }

  // return
  return json + '\n'
}

function compactJson (text, padding = false) {
  return text
    .replace(/\[([\s\S]+?)\]/g, function (text) {
      const elements = text.match(/".+?"/g)
      const p = padding ? ' ' : ''
      return elements.length === 1
        ? `[${p}${elements[0]}${p}]`
        : text
    })
}

module.exports = {
  // bullets
  bullets,
  makeBullet,
  makeFileBullet,
  makeNoteBullet,
  makeObjectBullets,
  makeItemsBullets,
  makePathsBullets,

  // columns
  getLongestStringLength,
  makeColumns,

  // json
  compactJson,
  makeJson,

  // text
  makeHeader,
  indent,
  plural,
  para,
}

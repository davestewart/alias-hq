const Path = require('path')
const Fs = require('fs')

const { compactJson } = require('../utils/text')

function loadJson (filename, asText = false) {
  const path = Path.resolve(filename)
  try {
    const text = Fs.readFileSync(path, 'utf8')
    return asText
      ? text
      : JSON.parse(text)
  }
  catch (err) {
    console.warn(`Could not load "${filename}"`)
    return asText ? '' : null
  }
}

function saveJson (filename, data, compact = false) {
  // path
  const path = Path.resolve(filename)

  // get spacing
  const text = loadJson(filename, true) || ''
  const match = text.match(/^(\s+)"\w/)
  const spacing = match ? match[1] : '  '

  // get text
  let json = JSON.stringify(data, null, spacing)

  // compact arrays
  if (compact) {
    json = compactJson(json)
  }

  // save
  return saveText(path, json)
}

function saveText (path, text) {
  try {
    return Fs.writeFileSync(path, text, 'utf8')
  }
  catch (err) {
    console.warn(`Could not save "${Path.basename(text)}"`, err)
    return null
  }
}

module.exports = {
  loadJson,
  saveJson,
  saveText,
}

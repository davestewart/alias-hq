function replaceLine (path, line, options) {
  return line
}

module.exports = function (fileInfo, api, options) {
  const { path, source } = fileInfo
  const output = source
    .replace(/\bimport .*(['"]).+?\1'/mg, line => replaceLine(path, line, options))
    .replace(/\brequire\((['"]).+?\1\)/, line => replaceLine(path, line, options))
  // console.log(output)
  return output
}

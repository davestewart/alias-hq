module.exports = [
  function () {
    const expected = {
      '^@/(.*)': '/\\1',
      '^@packages/(.*)': '../packages/\\1',
      '^@classes/(.*)': 'classes/\\1',
      '^@app/(.*)': 'app/\\1',
      '^@data/(.*)': 'app/data/\\1',
      '^@services/(.*)': 'app/services/\\1',
      '^@views/(.*)': 'app/views/\\1'
    }
    return { expected }
  },
]

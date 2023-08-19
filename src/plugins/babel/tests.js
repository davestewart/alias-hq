module.exports = [
  function () {
    const expected = {
      '^@/(.*)': '/\\1',
      '^@packages/(.*)': '../packages/\\1',
      '^@classes/(.*)': 'classes/\\1',
      '^@app/(.*)': 'app/\\1',
      '^@data/(.*)': 'app/data/\\1',
      '@settings': 'app/settings.js',
      '^@services/(.*)': 'app/services/\\1',
      '^@views/(.*)': 'app/views/\\1',
      '^@alias-hq/(.*)': '../../src/\\1',
    }
    return { expected }
  },
]

module.exports = [
  function () {
    const expected = {
      '^@/(.*)$': '<rootDir>/demo/src/$1',
      '^@packages/(.*)$': '<rootDir>/demo/packages/$1',
      '^@classes/(.*)$': '<rootDir>/demo/src/classes/$1',
      '^@app/(.*)$': '<rootDir>/demo/src/app/$1',
      '^@data/(.*)$': '<rootDir>/demo/src/app/data/$1',
      '^@services/(.*)$': [
        '<rootDir>/demo/src/app/services/$1',
        '<rootDir>/demo/packages/services/$1',
      ],
      '^@views/(.*)$': '<rootDir>/demo/src/app/views/$1'
    }
    return { expected }
  },
]

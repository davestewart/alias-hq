module.exports = [
  function () {
    const label = 'string'
    const options = {
      format: 'string'
    }
    const expected = {
      '^@/(.*)$': '<rootDir>/src/$1',
      '^@packages/(.*)$': '<rootDir>/packages/$1',
      '^@classes/(.*)$': '<rootDir>/src/classes/$1',
      '^@app/(.*)$': '<rootDir>/src/app/$1',
      '^@data/(.*)$': '<rootDir>/src/app/data/$1',
      '^@services/(.*)$': '<rootDir>/src/app/services/$1',
      '^@views/(.*)$': '<rootDir>/src/app/views/$1',
      '^@settings$': '<rootDir>/src/app/settings.js',
      '^@alias-hq/(.*)$': '<rootDir>/../src/$1',
    }
    return { label, options, expected }
  },

  function () {
    const label = 'array'
    const options = {
      format: 'array'
    }
    const expected = {
      '^@/(.*)$': '<rootDir>/src/$1',
      '^@packages/(.*)$': '<rootDir>/packages/$1',
      '^@classes/(.*)$': '<rootDir>/src/classes/$1',
      '^@app/(.*)$': '<rootDir>/src/app/$1',
      '^@data/(.*)$': '<rootDir>/src/app/data/$1',
      '^@services/(.*)$': [
        '<rootDir>/src/app/services/$1',
        '<rootDir>/packages/services/$1',
      ],
      '^@views/(.*)$': '<rootDir>/src/app/views/$1',
      '^@settings$': '<rootDir>/src/app/settings.js',
      '^@alias-hq/(.*)$': '<rootDir>/../src/$1',
    }
    return { label, options, expected }
  },
]

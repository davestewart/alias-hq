module.exports = [
  function () {
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
      '^@views/(.*)$': '<rootDir>/src/app/views/$1'
    }
    return { expected }
  },
]

module.exports = [
  function () {
    const expected = {
      '^@api/(.*)$': '<rootDir>/src/api/$1',
      '^@app/(.*)$': '<rootDir>/src/app/$1',
      '^@config/(.*)$': '<rootDir>/src/app/config/$1',
      '^@services/(.*)$': '<rootDir>/src/app/services/$1',
      '^@utils/(.*)$': [
        '<rootDir>/src/common/utils/$1',
        '<rootDir>/src/vendor/utils/$1',
      ],
    }
    return { expected }
  },
]

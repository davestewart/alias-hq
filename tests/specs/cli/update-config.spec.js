const { parsePathsFromText } = require('../../../cli/utils/paths')
const { makePaths } = require('../../../cli/configuration/update')

// ---------------------------------------------------------------------------------------------------------------------
// tests
// ---------------------------------------------------------------------------------------------------------------------

describe('path generation', function () {

  const folders = parsePathsFromText(`
    /projects/project/absolute_up/
    /projects/project/src/one/
    /projects/project/src/one/two/
    '/projects/project/src/single_quoted/'
    "/projects/project/src/double_quoted/"
    "two words"
    one_word
    ../relative_up
    file.js
  `)

  const config = {
    rootUrl: '/projects/project',
  }

  const answers = {
    baseUrl: 'src',
    prefix: '@',
    type: 'new',
  }

  const paths = makePaths(folders, config, answers)

  const expected = {
    '@absolute_up/*': ['../absolute_up/*'],
    '@one/*': ['one/*'],
    '@two/*': ['one/two/*'],
    '@single_quoted/*': ['single_quoted/*'],
    '@double_quoted/*': ['double_quoted/*'],
    '@two words/*': ['two words/*'],
    '@one_word/*': ['one_word/*'],
    '@relative_up/*': ['../relative_up/*'],
    '@file': ['file.js'],
  }

  it('should convert paths to json', function () {
    expect(paths).toEqual(expected)
  })
})

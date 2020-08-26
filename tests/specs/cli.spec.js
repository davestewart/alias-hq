const { makePaths, getFolders } = require('../../cli/paths')

// ---------------------------------------------------------------------------------------------------------------------
// tests
// ---------------------------------------------------------------------------------------------------------------------

describe('path generation', function () {

  const settings = {
    rootUrl: '/projects/project',
    baseUrl: 'src',
    prefix: '@',
    type: 'new',
  }

  const folders = getFolders(`
    /projects/project/absolute_up/
    /projects/project/src/one/
    /projects/project/src/one/two/
    '/projects/project/src/single_quoted/'
    "/projects/project/src/double_quoted/"
    "two words"
    one_word
    ../relative_up
  `)

  const paths = makePaths(folders, settings)

  const expected = {
    '@absolute_up/*': ['../absolute_up/*'],
    '@one/*': ['one/*'],
    '@two/*': ['one/two/*'],
    '@single_quoted/*': ['single_quoted/*'],
    '@double_quoted/*': ['double_quoted/*'],
    '@two words/*': ['two words/*'],
    '@one_word/*': ['one_word/*'],
    '@relative_up/*': ['../relative_up/*'],
  }

  it('should convert paths to json', function () {
    expect(paths).toEqual(expected)
  })
})

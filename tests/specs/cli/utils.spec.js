describe('dedupe paths', function () {
  const actual = [
    '. ../ demo demo/.. ../alias-hq demo/src demo/src/app',
    'demo/.. ../alias-hq demo/src demo/src/app',
    'demo/src/foo/.. demo/src demo/packages demo/src/app',
    'demo/packages',
  ]
})

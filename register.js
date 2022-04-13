/**
 *
 *  Alias-hq: Register
 *  @description provides a script to easily register paths from any package script
 *
 *  Usage: ts-node -r alias-hq/register src/index
 *  with nodemon: nodemon --exec ts-node -r alias-hq/register src/index
 *
 */

require('./src/index').get('module-alias')

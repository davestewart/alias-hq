// const fetch = require('../fetch')
import fetch from '../fetch'
import settings from './settings'

export function foo () {
  return fetch('foo', settings)
}

import fetch from '../../packages/fetch'

export default class User {
  constructor (config) {
    this.url = config.url
  }

  load (id) {
    return fetch(`${this.url}/users/${id}`)
  }
}

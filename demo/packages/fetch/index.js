export default function (url, payload) {
  return Promise.resolve(JSON.stringify({ url, payload }))
}

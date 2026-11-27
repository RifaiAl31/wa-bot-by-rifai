// Pengganti node-fetch untuk fitur tambahan: pakai fetch bawaan Node, tapi tetap mendukung body `form-data`
// (paket form-data) dan res.buffer() / opsi { timeout } seperti node-fetch.
'use strict'
const streamToBuffer = (s) => new Promise((resolve, reject) => {
  const chunks = []
  s.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)))
  s.on('end', () => resolve(Buffer.concat(chunks)))
  s.on('error', reject)
  if (typeof s.resume === 'function') s.resume()
})

async function nodeFetch(url, opts = {}) {
  const o = { ...opts }
  const b = o.body
  if (b && typeof b.getHeaders === 'function') {
    o.body = await streamToBuffer(b)
    o.headers = { ...(o.headers || {}), ...b.getHeaders() }
  }
  const { timeout, ...rest } = o
  if (timeout && !rest.signal) rest.signal = AbortSignal.timeout(timeout)
  if (rest.agent) delete rest.agent
  const res = await fetch(url, rest)
  if (typeof res.buffer !== 'function') {
    try { Object.defineProperty(res, 'buffer', { value: async () => Buffer.from(await res.arrayBuffer()), configurable: true }) } catch {}
  }
  return res
}
nodeFetch.default = nodeFetch
nodeFetch.__esModule = true
nodeFetch.Headers = globalThis.Headers
nodeFetch.Request = globalThis.Request
nodeFetch.Response = globalThis.Response
module.exports = nodeFetch

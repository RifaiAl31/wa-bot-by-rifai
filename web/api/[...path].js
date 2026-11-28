// Vercel (Hobby/Free) proxy: frontend statis di Vercel, API tetap di VPS tempat bot jalan.
// BACKEND_URL = https://<domain-vps-atau-tunnel>/  (hanya dibaca di server, tidak dikirim ke browser).
export const config = { runtime: 'nodejs20.x' }

const BACKEND = String(process.env.BACKEND_URL || process.env.DASHBOARD_BACKEND_URL || '').replace(/\/+$/, '')

function json(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

module.exports = async (req, res) => {
  const url = new URL(req.url || '/', 'http://localhost')
  if (!url.pathname.startsWith('/api/')) return json(res, 404, { error: 'Endpoint tidak ditemukan.' })
  if (!BACKEND) return json(res, 503, { error: 'BACKEND_URL belum diset di Vercel. Set ke URL HTTPS VPS/tunnel tempat bot berjalan.' })

  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const body = Buffer.concat(chunks)
  const headers = {}
  for (const name of ['cookie', 'origin', 'accept', 'content-type', 'x-csrf-token']) {
    if (req.headers[name]) headers[name] = req.headers[name]
  }
  const target = `${BACKEND}${url.pathname}${url.search}`
  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : body,
      redirect: 'manual',
      signal: AbortSignal.timeout(8000),
    })
    res.statusCode = upstream.status
    const cookies = typeof upstream.headers.getSetCookie === 'function'
      ? upstream.headers.getSetCookie()
      : [upstream.headers.get('set-cookie')].filter(Boolean)
    if (cookies.length) res.setHeader('Set-Cookie', cookies)
    const contentType = upstream.headers.get('content-type')
    if (contentType) res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'no-store')
    res.end(Buffer.from(await upstream.arrayBuffer()))
  } catch (err) {
    json(res, 502, { error: 'Backend WhatsApp tidak dapat dijangkau dari Vercel. Periksa BACKEND_URL dan tunnel/VPS.', detail: err.name })
  }
}

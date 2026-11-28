// URL dashboard yang dipakai command WhatsApp. Bisa dari .env (DASHBOARD_PUBLIC_URL)
// atau diset dari WhatsApp lewat `.auto-web set <url>` dan disimpan di database/.
// Tidak ada kredensial di sini — hanya URL publik dashboard.
'use strict'
const fs = require('fs')
const path = require('path')
const { DATA_DIR } = require('./autoAnnouncementData')

function file() {
  return process.env.DASHBOARD_URL_FILE
    ? path.resolve(process.env.DASHBOARD_URL_FILE)
    : path.join(DATA_DIR, 'dashboard-url.json')
}
function normalize(value) {
  const raw = String(value || '').trim().replace(/\/+$/, '')
  if (!/^https?:\/\/\S+$/i.test(raw)) return null
  try {
    const u = new URL(raw)
    if (!['http:', 'https:'].includes(u.protocol)) return null
    return raw
  } catch { return null }
}
function dashboardLink(value) {
  const base = normalize(value)
  if (!base) return ''
  const u = new URL(base)
  const cleanPath = u.pathname.replace(/\/+$/, '')
  const pathname = cleanPath.endsWith('/dashboard') ? cleanPath : `${cleanPath}/dashboard`
  return `${u.origin}${pathname}${u.search || ''}`
}
function get() {
  for (const key of ['DASHBOARD_PUBLIC_URL', 'DASHBOARD_VERCEL_URL']) {
    const fromEnv = normalize(process.env[key])
    if (fromEnv) return fromEnv
  }
  try {
    return normalize(JSON.parse(fs.readFileSync(file(), 'utf8')).url) || ''
  } catch { return '' }
}
function source() {
  for (const key of ['DASHBOARD_PUBLIC_URL', 'DASHBOARD_VERCEL_URL']) {
    if (normalize(process.env[key])) return `.env:${key}`
  }
  try {
    if (normalize(JSON.parse(fs.readFileSync(file(), 'utf8')).url)) return 'whatsapp'
  } catch {}
  return ''
}
function set(value) {
  const url = normalize(value)
  if (!url) throw new Error('URL tidak valid. Contoh: .auto-web set https://nama-project.vercel.app')
  const target = file()
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, JSON.stringify({ url, updatedAt: new Date().toISOString() }, null, 2), { mode: 0o600 })
  return url
}
function reset() {
  try { fs.unlinkSync(file()); return true } catch { return false }
}
module.exports = { FILE: file(), file, normalize, dashboardLink, get, source, set, reset }

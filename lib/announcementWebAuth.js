// Autentikasi admin dashboard: password dari environment (tidak pernah dikirim ke frontend),
// hash scrypt + salt di file lokal, session HMAC ber-tanda-tangan, CSRF, dan rate limit login.
'use strict'
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const { DATA_DIR } = require('./autoAnnouncementData')

const FILE = process.env.DASHBOARD_AUTH_FILE
  ? path.resolve(process.env.DASHBOARD_AUTH_FILE)
  : path.join(DATA_DIR, 'dashboard-auth.json')
const COOKIE = 'vx_admin_session'
const TTL_MS = (Number(process.env.DASHBOARD_SESSION_HOURS) || 8) * 3600 * 1000
const MAX_FAILS = 5
const FAIL_WINDOW_MS = 15 * 60 * 1000
const fails = new Map()

function b64u(value) { return Buffer.from(value).toString('base64url') }
function unb64u(value) { return Buffer.from(String(value || ''), 'base64url') }

function readAuthFile() {
  try { return JSON.parse(fs.readFileSync(FILE, 'utf8')) } catch { return {} }
}
function writeAuthFile(obj) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true })
  fs.writeFileSync(FILE, JSON.stringify(obj, null, 2), { mode: 0o600 })
}
function secret() {
  if (process.env.DASHBOARD_SESSION_SECRET) return process.env.DASHBOARD_SESSION_SECRET
  const file = readAuthFile()
  if (!file.secret) {
    file.secret = crypto.randomBytes(32).toString('hex')
    writeAuthFile(file)
  }
  return file.secret
}
function password() { return String(process.env.DASHBOARD_PASSWORD || '') }
function configured() { return password().length >= 8 }

function passwordRecord() {
  // File hanya menyimpan salt; hash dihitung ulang dari password environment sehingga
  // mengganti DASHBOARD_PASSWORD langsung berlaku setelah restart tanpa migrate file.
  const file = readAuthFile()
  if (!file.salt) {
    file.salt = crypto.randomBytes(16).toString('hex')
    writeAuthFile(file)
  }
  return { salt: file.salt, hash: crypto.scryptSync(password(), file.salt, 32).toString('hex') }
}
function passwordMatches(input) {
  const { salt, hash } = passwordRecord()
  const expected = Buffer.from(hash, 'hex')
  const actual = crypto.scryptSync(String(input || ''), salt, expected.length)
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual)
}

function sign(payload) {
  const body = b64u(JSON.stringify(payload))
  const mac = crypto.createHmac('sha256', secret()).update(body).digest('base64url')
  return `${body}.${mac}`
}
function verifyToken(token) {
  const [body, mac] = String(token || '').split('.')
  if (!body || !mac) return null
  const expected = crypto.createHmac('sha256', secret()).update(body).digest('base64url')
  const a = Buffer.from(String(mac))
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  try {
    const payload = JSON.parse(unb64u(body).toString('utf8'))
    if (payload.sub !== 'admin' || !payload.csrf || Date.now() > Number(payload.exp)) return null
    return payload
  } catch { return null }
}
function parseCookies(header) {
  const out = {}
  for (const part of String(header || '').split(';')) {
    const i = part.indexOf('=')
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim())
  }
  return out
}
function cookieAttributes() {
  const sameSite = String(process.env.DASHBOARD_COOKIE_SAME_SITE || 'lax')
  const attrs = [`Path=/`, `HttpOnly`, `Max-Age=${Math.floor(TTL_MS / 1000)}`, `SameSite=${sameSite}`]
  if (process.env.DASHBOARD_COOKIE_SECURE === '1' || sameSite.toLowerCase() === 'none') attrs.push('Secure')
  return attrs.join('; ')
}
function verifyRequest(req) {
  const token = parseCookies(req.headers?.cookie)[COOKIE]
  const payload = verifyToken(token)
  return payload ? { authenticated: true, csrfToken: payload.csrf, sub: payload.sub } : { authenticated: false }
}
function checkCsrf(req, session) {
  if (!session?.authenticated) return false
  const got = String(req.headers?.['x-csrf-token'] || '')
  const want = String(session.csrfToken || '')
  if (!got || !want) return false
  const a = Buffer.from(got)
  const b = Buffer.from(want)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}
function blocked(ip) {
  const entry = fails.get(ip)
  if (!entry) return false
  if (Date.now() - entry.since > FAIL_WINDOW_MS) { fails.delete(ip); return false }
  return entry.count >= MAX_FAILS
}
function login(input, ip = '-') {
  if (!configured()) return { error: 'Dashboard belum dikonfigurasi. Set DASHBOARD_PASSWORD di VPS lalu restart bot.' }
  if (blocked(ip)) return { error: 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.' }
  if (!passwordMatches(input)) {
    const entry = fails.get(ip) || { count: 0, since: Date.now() }
    entry.count += 1
    fails.set(ip, entry)
    return { error: 'Password salah.' }
  }
  fails.delete(ip)
  const payload = { sub: 'admin', csrf: crypto.randomBytes(24).toString('hex'), exp: Date.now() + TTL_MS }
  return { token: `${COOKIE}=${encodeURIComponent(sign(payload))}; ${cookieAttributes()}`, csrfToken: payload.csrf }
}
function logoutCookie() { return `${COOKIE}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax` }

module.exports = {
  COOKIE, configured, status: (req) => ({ configured: configured(), authenticated: verifyRequest(req).authenticated }),
  login, logoutCookie, verifyRequest, checkCsrf,
}

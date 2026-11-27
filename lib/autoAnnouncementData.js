// Arsip agenda Auto Pengumuman (.auto-pengumuman). Disimpan atomik di database/,
// jadi agenda + status pengiriman tetap ada setelah bot restart.
'use strict'
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const DATA_DIR = process.env.AUTO_ANNOUNCEMENT_DATA_DIR
  ? path.resolve(process.env.AUTO_ANNOUNCEMENT_DATA_DIR)
  : path.join(ROOT, 'database')
const FILE = path.join(DATA_DIR, 'auto-announcements.json')

const empty = () => ({ seq: 0, items: [], runs: [] })
let state
let dirty = false

function load() {
  try {
    const parsed = JSON.parse(fs.readFileSync(FILE, 'utf8'))
    return {
      seq: Number(parsed.seq) || 0,
      items: Array.isArray(parsed.items) ? parsed.items : [],
      runs: Array.isArray(parsed.runs) ? parsed.runs : [],
    }
  } catch {
    return empty()
  }
}
state = load()

function save() {
  dirty = false
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    const tmp = `${FILE}.tmp`
    fs.writeFileSync(tmp, JSON.stringify(state, null, 2))
    fs.renameSync(tmp, FILE)
  } catch (err) {
    dirty = true
    console.log('[AUTO-ANN] gagal menyimpan data:', err.message)
  }
}
const flush = () => { if (dirty) save() }
process.once('exit', flush)
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.once(sig, () => { flush(); process.exit(0) })
}

function normalizeId(id) {
  const digits = String(id || '').replace(/\D/g, '')
  return digits ? `AN${Number(digits)}` : ''
}

function nextId() {
  state.seq += 1
  save()
  return `AN${state.seq}`
}

function add(row) {
  const item = Object.assign({
    id: nextId(), title: '', body: '', weekday: 0, eventDate: null, eventTime: '',
    repeat: 'none', offsetDays: 0, sendTime: '08:00', format: 'text',
    targets: [], is_active: 1, createdBy: null, createdAt: new Date().toISOString(),
    noteId: null,
  }, row)
  state.items.push(item)
  save()
  return item
}

function get(id) {
  const normalized = normalizeId(id)
  return state.items.find((a) => a.id === normalized) || null
}
function list() { return state.items.slice() }
function setActive(id, active) {
  const item = get(id)
  if (!item) return false
  item.is_active = active ? 1 : 0
  save()
  return true
}
function remove(id) {
  const item = get(id)
  if (!item) return false
  state.items = state.items.filter((a) => a.id !== item.id)
  state.runs = state.runs.filter((r) => r.id !== item.id)
  save()
  return true
}

const runKey = (id, sendDate, sendTime, eventDate) =>
  `${normalizeId(id)}|${sendDate}|${sendTime}|${eventDate}`

// Satu kejadian (agenda + tanggal kegiatan + jam kirim) hanya boleh diklaim sekali.
function claimRun(id, sendDate, sendTime, eventDate) {
  const key = runKey(id, sendDate, sendTime, eventDate)
  if (state.runs.some((r) => r.key === key)) return null
  const run = {
    key, id: normalizeId(id), sendDate, sendTime, eventDate,
    status: 'claimed', createdAt: new Date().toISOString(), details: [],
  }
  state.runs.push(run)
  save()
  return run
}
function finishRun(run, result) {
  if (!run) return
  run.status = result.status || 'failed'
  run.details = result.details || []
  run.sentAt = new Date().toISOString()
  save()
}
function latestRun(id) {
  return state.runs.filter((r) => r.id === normalizeId(id)).slice(-1)[0] || null
}
function reload() { state = load() }
function _resetForTests() { state = empty(); save() }

module.exports = {
  FILE, DATA_DIR, save, flush, normalizeId, nextId, add, get, list, setActive, remove,
  claimRun, finishRun, latestRun, reload, _resetForTests,
}

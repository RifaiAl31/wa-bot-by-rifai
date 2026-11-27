// Satu koleksi pengumuman untuk teks DAN media, dipakai wizard (.add), kalender,
// dan scheduler. File tersimpan di database/ sehingga jadwal + status selamat restart.
'use strict'
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const DATA_DIR = process.env.ANNOUNCEMENT_DATA_DIR
  ? path.resolve(process.env.ANNOUNCEMENT_DATA_DIR)
  : path.join(ROOT, 'database')
const FILE = path.join(DATA_DIR, 'announcements.json')

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

// Tulis atomik: crash saat restart tidak pernah meninggalkan file JSON setengah jadi.
function save() {
  dirty = false
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    const tmp = `${FILE}.tmp`
    fs.writeFileSync(tmp, JSON.stringify(state, null, 2))
    fs.renameSync(tmp, FILE)
  } catch (err) {
    dirty = true
    console.log('[ANN] gagal menyimpan data pengumuman:', err.message)
  }
}

const flush = () => { if (dirty) save() }
process.once('exit', flush)
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.once(sig, () => { flush(); process.exit(0) })
}

function nextId() {
  state.seq += 1
  save()
  return `A${state.seq}`
}

function add(row) {
  const item = Object.assign({
    id: nextId(), type: 'teks', title: '', body: '', weekday: 0,
    eventDate: null, eventTime: null, sendTime: '08:00', targets: [],
    media: null, is_active: 1, createdBy: null, createdAt: new Date().toISOString(),
  }, row)
  state.items.push(item)
  save()
  return item
}

function get(id) {
  return state.items.find((a) => String(a.id).toUpperCase() === String(id || '').trim().toUpperCase()) || null
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

const runKey = (id, date, time) => `${String(id).toUpperCase()}|${date}|${time}`

// Satu jadwal hanya boleh diklaim sekali. Dipanggil tepat sebelum pengiriman.
function claimRun(id, date, time) {
  const key = runKey(id, date, time)
  if (state.runs.some((r) => r.key === key)) return null
  const run = { key, id, date, time, status: 'claimed', createdAt: new Date().toISOString(), details: [] }
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
  return state.runs.filter((r) => r.id === String(id).toUpperCase()).slice(-1)[0] || null
}

// Dipakai test untuk mensimulasikan restart proses.
function reload() { state = load() }

function _resetForTests() {
  state = empty()
  save()
}

module.exports = {
  FILE, DATA_DIR, save, flush, nextId, add, get, list, setActive, remove,
  claimRun, finishRun, latestRun, reload, _resetForTests,
}

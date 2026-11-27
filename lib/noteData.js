// Arsip catatan rapat hasil analisis AI. ID CAT001, CAT002, ...
'use strict'
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const DATA_DIR = process.env.CATATAN_DATA_DIR
  ? path.resolve(process.env.CATATAN_DATA_DIR)
  : path.join(ROOT, 'database')
const FILE = path.join(DATA_DIR, 'catatan-rapat.json')
const empty = () => ({ seq: 0, items: [] })
let state
let dirty = false

function load() {
  try {
    const parsed = JSON.parse(fs.readFileSync(FILE, 'utf8'))
    return {
      seq: Number(parsed.seq) || 0,
      items: Array.isArray(parsed.items) ? parsed.items : [],
    }
  } catch { return empty() }
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
    console.log('[CATATAN] gagal menyimpan:', err.message)
  }
}
const flush = () => { if (dirty) save() }
process.once('exit', flush)
for (const sig of ['SIGINT', 'SIGTERM']) process.once(sig, () => { flush(); process.exit(0) })

function normalizeId(id) {
  const digits = String(id || '').replace(/\D/g, '')
  return digits ? `CAT${String(Number(digits)).padStart(3, '0')}` : ''
}
function nextId() {
  state.seq += 1
  save()
  return `CAT${String(state.seq).padStart(3, '0')}`
}
function add(row) {
  const item = Object.assign({
    id: nextId(), title: '', tanggal: '', transcript: {}, raw: '',
    pages: [], unclear: [], createdBy: null, createdAt: new Date().toISOString(),
  }, row)
  state.items.push(item)
  save()
  return item
}
function get(id) {
  const normalized = normalizeId(id)
  return state.items.find((x) => x.id === normalized) || null
}
function list() { return state.items.slice() }
function remove(id) {
  const item = get(id)
  if (!item) return false
  state.items = state.items.filter((x) => x.id !== item.id)
  save()
  return true
}
function search(term) {
  const needle = String(term || '').trim().toLowerCase()
  if (!needle) return []
  return state.items.filter((item) => JSON.stringify(item).toLowerCase().includes(needle))
}
function reload() { state = load() }
function _resetForTests() { state = empty(); save() }

module.exports = { FILE, DATA_DIR, save, flush, normalizeId, nextId, add, get, list, remove, search, reload, _resetForTests }

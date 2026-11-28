// Arsip agenda Auto Pengumuman (.auto-pengumuman). Disimpan atomik di database/,
// jadi agenda + status pengiriman tetap ada setelah bot restart.
// File yang sama dipakai WhatsApp DAN dashboard web — tidak ada database kedua.
'use strict'
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const DATA_DIR = process.env.AUTO_ANNOUNCEMENT_DATA_DIR
  ? path.resolve(process.env.AUTO_ANNOUNCEMENT_DATA_DIR)
  : path.join(ROOT, 'database')
const FILE = path.join(DATA_DIR, 'auto-announcements.json')

const empty = () => ({ seq: 0, tseq: 0, items: [], runs: [], templates: [], audit: [] })
let state
let dirty = false

function load() {
  try {
    const parsed = JSON.parse(fs.readFileSync(FILE, 'utf8'))
    return {
      seq: Number(parsed.seq) || 0,
      tseq: Number(parsed.tseq) || 0,
      items: Array.isArray(parsed.items) ? parsed.items : [],
      runs: Array.isArray(parsed.runs) ? parsed.runs : [],
      templates: Array.isArray(parsed.templates) ? parsed.templates : [],
      audit: Array.isArray(parsed.audit) ? parsed.audit : [],
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
function normalizeTemplateId(id) {
  const digits = String(id || '').replace(/\D/g, '')
  return digits ? `T${Number(digits)}` : ''
}

function nextId() {
  state.seq += 1
  save()
  return `AN${state.seq}`
}
function nextTemplateId() {
  state.tseq += 1
  return `T${state.tseq}`
}

function add(row) {
  const item = Object.assign({
    id: nextId(), title: '', body: '', weekday: 0, eventDate: null, eventTime: '',
    location: '', repeat: 'none', offsetDays: 0, sendTime: '08:00', format: 'text',
    targets: [], is_active: 1, status: 'active', mode: 'relative', scheduleAt: null,
    imagePath: null, createdBy: null, createdAt: new Date().toISOString(),
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

const EDITABLE = new Set([
  'title', 'body', 'weekday', 'eventDate', 'eventTime', 'location', 'repeat',
  'offsetDays', 'sendTime', 'format', 'targets', 'is_active', 'status', 'mode',
  'scheduleAt', 'imagePath', 'noteId',
])
function update(id, patch) {
  const item = get(id)
  if (!item || !patch || typeof patch !== 'object') return null
  for (const [key, value] of Object.entries(patch)) {
    if (EDITABLE.has(key)) item[key] = value
  }
  item.updatedAt = new Date().toISOString()
  save()
  return item
}
function setActive(id, active) {
  return !!update(id, { is_active: active ? 1 : 0, status: active ? 'active' : 'paused' })
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
function claimRun(id, sendDate, sendTime, eventDate, extra = {}) {
  const key = runKey(id, sendDate, sendTime, eventDate)
  return claimUnique(key, Object.assign({
    id: normalizeId(id), sendDate, sendTime, eventDate,
  }, extra))
}

// Kunci unik umum dipakai pengiriman manual/retry: satu kunci = satu pengiriman.
function claimUnique(key, extra = {}) {
  if (state.runs.some((r) => r.key === key)) return null
  const run = Object.assign({
    key, id: '', status: 'claimed', kind: 'scheduled', actor: null,
    createdAt: new Date().toISOString(), details: [],
  }, extra)
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
function findRun(key) {
  return state.runs.find((r) => r.key === String(key || '')) || null
}
function listRuns(id) {
  const want = normalizeId(id)
  return state.runs.filter((r) => !want || r.id === want).slice()
}
function claimRetry(runKey) {
  const original = findRun(runKey)
  if (!original || original.status !== 'failed') return null
  const attempt = state.runs.filter((r) => r.key.startsWith(`${runKey}#retry`)).length + 1
  return claimUnique(`${runKey}#retry${attempt}`, {
    id: original.id, sendDate: original.sendDate, sendTime: original.sendTime,
    eventDate: original.eventDate, kind: 'retry', actor: original.actor || null,
    retryOf: runKey,
  })
}
function stats() {
  const items = state.items
  const runs = state.runs
  return {
    total: items.length,
    active: items.filter((r) => Number(r.is_active) === 1 && r.status !== 'draft').length,
    draft: items.filter((r) => r.status === 'draft').length,
    scheduled: items.filter((r) => r.mode === 'once' && r.scheduleAt && Number(r.is_active) === 1).length,
    pending: runs.filter((r) => r.status === 'claimed').length,
    sent: runs.filter((r) => r.status === 'sent').length,
    failed: runs.filter((r) => r.status === 'failed').length,
  }
}

// ---- Template pengumuman (dipakai dashboard, tidak mengubah format pesan WA) ----
function addTemplate(row) {
  const template = Object.assign({
    id: nextTemplateId(), name: '', body: '', createdAt: new Date().toISOString(),
  }, row)
  state.templates.push(template)
  save()
  return template
}
function getTemplate(id) {
  const normalized = normalizeTemplateId(id)
  return state.templates.find((t) => t.id === normalized) || null
}
function listTemplates() { return state.templates.slice() }
function updateTemplate(id, patch) {
  const template = getTemplate(id)
  if (!template || !patch || typeof patch !== 'object') return null
  if (typeof patch.name === 'string') template.name = patch.name
  if (typeof patch.body === 'string') template.body = patch.body
  template.updatedAt = new Date().toISOString()
  save()
  return template
}
function removeTemplate(id) {
  const template = getTemplate(id)
  if (!template) return false
  state.templates = state.templates.filter((t) => t.id !== template.id)
  save()
  return true
}

// ---- Audit aktivitas admin: append-only, dibatasi agar file tidak tumbuh tanpa batas ----
function appendAudit(entry) {
  state.audit.push(Object.assign({ at: new Date().toISOString() }, entry))
  if (state.audit.length > 500) state.audit = state.audit.slice(-500)
  save()
}
function listAudit() { return state.audit.slice().reverse() }

function reload() { state = load() }
function _resetForTests() { state = empty(); save() }

module.exports = {
  FILE, DATA_DIR, save, flush, normalizeId, normalizeTemplateId, nextId, add, get, list,
  update, setActive, remove, runKey, claimRun, claimUnique, finishRun, latestRun, findRun,
  listRuns, claimRetry, stats, addTemplate, getTemplate, listTemplates, updateTemplate,
  removeTemplate, appendAudit, listAudit, reload, _resetForTests,
}

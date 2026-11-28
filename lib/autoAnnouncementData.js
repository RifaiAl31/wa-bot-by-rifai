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

const DEFAULT_SETTINGS = {
  timezone: 'Asia/Jakarta',
  catchUp: 'skip',
  defaultSendTime: '19:00',
  maxPending: 20,
}
const empty = () => ({
  seq: 0, tseq: 0, items: [], runs: [], templates: [], audit: [],
  settings: { ...DEFAULT_SETTINGS },
})
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
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings && typeof parsed.settings === 'object' ? parsed.settings : {}) },
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
    id: nextId(), scheduleName: '', name: '', title: '', body: '', weekday: 0,
    eventDate: null, startDate: null, eventTime: '', location: '', repeat: 'none',
    offsetDays: 0, sendTime: '08:00', format: 'text',
    targets: [], is_active: 1, status: 'active', mode: 'relative', scheduleAt: null,
    imagePath: null, templateId: null, catchUp: 'skip',
    createdBy: null, createdAt: new Date().toISOString(), noteId: null,
  }, row)
  if (!item.name && row?.title) item.name = String(row.title).slice(0, 80)
  if (!item.scheduleName && item.name) item.scheduleName = item.name
  if (!item.startDate && item.eventDate) item.startDate = item.eventDate
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
  'scheduleName', 'name', 'title', 'body', 'weekday', 'eventDate', 'startDate',
  'eventTime', 'location', 'repeat', 'offsetDays', 'sendTime', 'format', 'targets',
  'is_active', 'status', 'mode', 'scheduleAt', 'imagePath', 'templateId', 'catchUp', 'noteId',
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
  if (result.snapshot) run.snapshot = result.snapshot
  if (result.status === 'queued' || result.status === 'pending_review') delete run.sentAt
  else run.sentAt = new Date().toISOString()
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
    pending: runs.filter((r) => ['claimed', 'queued', 'pending_review'].includes(r.status)).length,
    sent: runs.filter((r) => r.status === 'sent').length,
    failed: runs.filter((r) => r.status === 'failed').length,
    missed: runs.filter((r) => r.status === 'missed').length,
  }
}

// ---- Template pengumuman (dipakai dashboard, tidak mengubah format pesan WA) ----
function addTemplate(row) {
  const template = Object.assign({
    id: nextTemplateId(), name: '', title: '', body: '', imagePath: null,
    targets: [], weekday: 0, offsetDays: 1, sendTime: '19:00',
    createdAt: new Date().toISOString(),
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
  for (const key of ['name', 'title', 'body']) {
    if (typeof patch[key] === 'string') template[key] = patch[key]
  }
  for (const key of ['imagePath', 'targets', 'weekday', 'offsetDays', 'sendTime']) {
    if (patch[key] !== undefined) template[key] = patch[key]
  }
  template.updatedAt = new Date().toISOString()
  save()
  return template
}

// ---- Pengaturan sistem (disimpan bersama data agar satu file sumber kebenaran) ----
function getSettings() { return { ...DEFAULT_SETTINGS, ...(state.settings || {}) } }
function updateSettings(patch) {
  if (!patch || typeof patch !== 'object') return getSettings()
  const next = getSettings()
  if (['skip', 'online', 'review'].includes(patch.catchUp)) next.catchUp = patch.catchUp
  if (/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(String(patch.defaultSendTime || ''))) next.defaultSendTime = patch.defaultSendTime
  const max = Number(patch.maxPending)
  if (Number.isInteger(max) && max >= 1 && max <= 200) next.maxPending = max
  state.settings = next
  save()
  return getSettings()
}

// Tiga jadwal awal dibuat sekali saja dan MINTA admin mengisi(isi + grup) lalu mengaktifkan.
// Tidak mengirim apa pun karena status draft & targets kosong.
function seedInitialSchedules() {
  const existing = state.items.filter((r) => ['A', 'B', 'C'].includes(r.scheduleName)).length
  if (existing >= 3) return { added: 0, items: [] }
  const presets = [
    { scheduleName: 'Pengumuman A', weekday: 1, offsetDays: 1, sendTime: '19:00' },
    { scheduleName: 'Pengumuman B', weekday: 3, offsetDays: 1, sendTime: '19:00' },
    { scheduleName: 'Pengumuman C', weekday: 5, offsetDays: 0, sendTime: '06:00' },
  ]
  const added = []
  for (const preset of presets) {
    if (state.items.some((r) => r.scheduleName === preset.scheduleName)) continue
    added.push(add(Object.assign({
      name: preset.scheduleName, title: preset.scheduleName, body: '', targets: [],
      repeat: 'forever', mode: 'relative', status: 'draft', is_active: 0,
      format: 'text', createdBy: 'system', eventDate: null, startDate: null,
      eventTime: '', location: '', imagePath: null, catchUp: 'skip',
    }, preset)))
  }
  if (added.length) appendAudit({ actor: 'system', action: 'seed-schedules', target: added.map((r) => r.id).join(',') })
  return { added: added.length, items: added }
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
  removeTemplate, getSettings, updateSettings, seedInitialSchedules,
  appendAudit, listAudit, reload, _resetForTests,
}

import fs from 'fs'
import path from 'path'
import https from 'https'
import zlib from 'zlib'
import { rbRun, rbRegister } from '../../lib/engine/plugins.js'
import { liveDoc, legacyJson } from '../../lib/db/database.js'

const LINE = '━━━━━━━━━━━━━━━━'
const HOME = 'https://gemini.google.com/'
const API = 'https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?bl=boq_assistant-bard-web-server_20260917.13_p0&f.sid=1147530711385426743&hl=en-US&_reqid=2011320&rt=c'

// sesi per user -> database/tools.json (users[jid].extra.gemini)
const { data: store, save } = liveDoc('gemini', {}, 'gemini.json')

// ID pesan jawaban WhatsApp Bot -> reply ke pesan itu dijawab tanpa command
// disimpan di database/tools.json (geminiIds)
const MAX_IDS = 500
const idsDoc = liveDoc('geminiIds', [])
let answerIds = null
const loadIds = () => answerIds ||= new Set([...(legacyJson('gemini-ids.json', []) || []), ...idsDoc.data])
const rememberAnswer = id => {
  if (!id) return
  const set = loadIds()
  set.add(id)
  while (set.size > MAX_IDS) set.delete(set.values().next().value)
  try { idsDoc.data.splice(0, idsDoc.data.length, ...set); idsDoc.save() } catch {}
}

const req = (url, { method = 'GET', headers = {}, body } = {}) => new Promise((resolve, reject) => {
  const r = https.request(url, {
    method,
    headers: { 'accept-encoding': 'gzip, deflate, br', ...headers },
    maxHeaderSize: 262144
  }, res => {
    const chunks = []
    res.on('data', c => chunks.push(c))
    res.on('end', () => {
      let buf = Buffer.concat(chunks)
      try {
        const enc = res.headers['content-encoding']
        if (enc === 'gzip') buf = zlib.gunzipSync(buf)
        else if (enc === 'br') buf = zlib.brotliDecompressSync(buf)
        else if (enc === 'deflate') buf = zlib.inflateSync(buf)
      } catch {}
      resolve({ status: res.statusCode, headers: res.headers, text: buf.toString('utf8') })
    })
  })
  r.on('error', reject)
  if (body) r.write(body)
  r.end()
})

const getCookie = async () => {
  const r = await req(HOME, { method: 'HEAD' })
  const c = r.headers['set-cookie']?.[0]?.split('; ')?.[0]
  if (!c) throw Error('gagal mendapatkan kuki')
  return c
}

const DEBUG_FILE = path.join(process.cwd(), 'database', 'logs', 'gemini-debug.txt')
const dumpRaw = (why, text) => {
  try {
    fs.mkdirSync(path.dirname(DEBUG_FILE), { recursive: true })
    fs.writeFileSync(DEBUG_FILE, `[${new Date().toISOString()}] ${why}\n\n${String(text).slice(0, 20000)}`)
  } catch {}
  console.log(`[gemini] ${why} -> raw disimpan di ${DEBUG_FILE}`)
  console.log('[gemini] RAW:', String(text).slice(0, 800))
}

class ParseError extends Error {}

// Parser lebih toleran: scan semua baris & semua item, tidak bergantung ke o[0][2] saja
const parseReply = text => {
  const clean = String(text).replace(/^\)\]\}'\s*/, '').trim()
  let found = null
  let hasErr = false

  for (const line of clean.split('\n')) {
    let o
    try { o = JSON.parse(line) } catch { continue }
    if (!Array.isArray(o)) continue
    for (const item of o) {
      if (!Array.isArray(item)) continue
      if (item[0] === 'er') hasErr = true
      if (typeof item[2] !== 'string') continue
      try {
        const a = JSON.parse(item[2])
        const cands = a?.[4]
        if (!Array.isArray(cands)) continue
        const c = cands.find(x => typeof x?.[1]?.[0] === 'string' && x[1][0])
        if (c) found = { a, c }
      } catch {}
    }
  }

  if (!found) {
    dumpRaw(hasErr ? 'Gemini membalas error (er)' : 'format respons tidak dikenali', text)
    throw new ParseError(hasErr
      ? 'Gemini menolak request (sesi/limit/cookie)'
      : 'format respons tidak dikenali')
  }
  const { a, c } = found
  return { response: c[1][0], resumeArray: [a?.[1]?.[0], a?.[1]?.[1], c[0]] }
}

const askOnce = async (prompt, prev = '') => {
  let resumeArray = []
  let cookie
  try {
    if (!prev) throw 0
    ;({ resumeArray, cookie } = JSON.parse(atob(prev)))
    if (!cookie) throw 0
  } catch {
    resumeArray = []
    cookie = await getCookie()
  }

  const body = new URLSearchParams({
    'f.req': JSON.stringify([null, JSON.stringify([[prompt], ['en-US'], resumeArray])])
  }).toString()

  const res = await req(API, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'content-length': Buffer.byteLength(body),
      cookie
    },
    body
  })
  if (res.status !== 200) {
    dumpRaw(`HTTP ${res.status}`, res.text)
    throw Error(`HTTP ${res.status}`)
  }

  const r = parseReply(res.text)
  return {
    response: r.response,
    session: btoa(JSON.stringify({ cookie, resumeArray: r.resumeArray }))
  }
}

// Kalau gagal parse dengan sesi lama -> otomatis ulang dengan sesi baru (cookie baru)
const askGemini = async (prompt, prev = '') => {
  try {
    return await askOnce(prompt, prev)
  } catch (e) {
    if (prev && (e instanceof ParseError || /^HTTP (4|5)/.test(e.message))) {
      console.log('[gemini] sesi lama gagal, coba ulang dengan sesi baru')
      return await askOnce(prompt, '')
    }
    throw e
  }
}

const fmt = t => String(t)
  .replace(/https?:\/\/(?:[\w-]+\.)?googleusercontent\.com\/\S*/gi, '')
  .replace(/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/gm, LINE)
  .replace(/^#{1,6}\s*(.+)$/gm, (_, h) => `*${h.replace(/\*/g, '').trim()}*`)
  .replace(/^( {4,}|\t+)[*-]\s+/gm, '    ◦ ')
  .replace(/^\s{0,3}[*-]\s+/gm, '• ')
  .replace(/\*\*(.+?)\*\*/g, '*$1*')
  .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '$1 ($2)')
  .replace(/[ \t]+$/gm, '')
  .replace(/\n{3,}/g, '\n\n')
  .trim()

const validSession = s => {
  try {
    const o = JSON.parse(atob(s))
    return typeof o.cookie === 'string' && Array.isArray(o.resumeArray)
  } catch {
    return false
  }
}

const MENU = `GEMINI
${LINE}
- vanxone <pertanyaan>
- vanxone -e [nama]  export sesi
- vanxone -r  import sesi (reply file)
- vanxone reset  hapus sesi
- reply jawaban WhatsApp Bot  lanjut ngobrol tanpa command`

const feature = async () => {
  let handler = async (m, { sock, text, replyMode }) => {
    const raw = (text || '').trim()
    const [first = '', ...rest] = raw.split(/\s+/)
    // balasan lanjutan (reply jawaban WhatsApp Bot) selalu dianggap pesan biasa, bukan flag reset / -e / -r
    const flag = replyMode ? '' : first.toLowerCase()
    const user = m.sender
    const chat = m.chat

    if (flag === 'reset') {
      const had = !!store[user]
      delete store[user]
      save()
      return m.reply(had ? `SESI DIHAPUS\n${LINE}\nPercakapan baru dimulai.` : 'Tidak ada sesi aktif.')
    }

    if (flag === '-e') {
      if (!store[user]) return m.reply('❌ Belum ada sesi. Tanya dulu: gemini <pertanyaan>')
      const name = rest.join('-').replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || `gemini-${Date.now()}`
      const file = await sock.sendMessage(chat, {
        document: Buffer.from(JSON.stringify({ type: 'gemini-session', name, session: store[user] })),
        mimetype: 'application/json',
        fileName: `${name}.gemini.json`
      }, { quoted: m })
      return sock.sendMessage(chat, {
        text: `SESI DI-EXPORT\n${LINE}\nNama : ${name}\nImport: reply file di atas dengan "gemini -r"`
      }, { quoted: file })
    }

    if (flag === '-r') {
      if (!m.quoted) return m.reply('❌ Reply file export dengan: gemini -r')
      let obj
      try {
        obj = JSON.parse((await m.quoted.download()).toString('utf8'))
      } catch (e) {
        return m.reply(`❌ File tidak bisa dibaca: ${e.message}`)
      }
      if (obj?.type !== 'gemini-session' || !validSession(obj.session)) return m.reply('❌ File export tidak valid')
      store[user] = obj.session
      save()
      return m.reply(`SESI DI-IMPORT\n${LINE}\nNama : ${obj.name || '-'}\nLanjutkan dengan: gemini <pertanyaan>`)
    }

    const prompt = raw || m.quoted?.text || ''
    if (!prompt) return m.reply(MENU)

    try {
      const { response, session } = await askGemini(prompt, store[user])
      store[user] = session
      save()
      const sent = await sock.sendMessage(chat, { text: fmt(response) }, { quoted: m })
      rememberAnswer(sent?.key?.id)
    } catch (e) {
      console.error('[gemini]', e)
      await m.reply(`❌ Gagal: ${e.message}\nCoba lagi, atau "gemini reset" jika terus error.`)
    }
  }

  handler.command = ['g']
  handler.owner = false
  handler.premium = false
  handler.group = false
  handler.private = false
  handler.admin = false
  handler.botadmin = false
  handler.noJadiBot = false
  return handler
}

rbRegister('ai/gemini-vanxone', feature)

let handler = async (m, ctx) => {
  // .vanxone <pesan>
  if (ctx.command) return rbRun('ai/gemini-vanxone', m, ctx)

  // pesan biasa: hanya dijawab kalau reply ke jawaban WhatsApp Bot (ID-nya tersimpan)
  const q = m.quoted
  const body = String(ctx.body || m.body || '').trim()
  if (!body || !q?.id || !loadIds().has(q.id)) return false

  await rbRun('ai/gemini-vanxone', m, { ...ctx, text: body, replyMode: true })
  return true
}

handler.command = ['gemini']
handler.subs = ['g']
handler.tags = ['ai']
handler.customPrefix = /^[\s\S]+$/

export default handler
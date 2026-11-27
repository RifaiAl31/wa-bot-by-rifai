import axios from 'axios'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'
import { pickMedia } from '../../lib/core/file.js'

const APIKEY = 'zet_free100'
const BASE = 'https://zettai.my.id/api/v1/ai/cover'
const SHORTCUT = ['patrick', 'villager', 'miku']
const DEFAULT_MODEL = 'patrick'
const MAX_AUDIO_MB = 16

const http = axios.create({
    timeout: 180000,
    headers: { 'x-api-key': APIKEY },
    validateStatus: () => true
})

const isUrl = (s) => /^https?:\/\/\S+$/i.test(s || '')


// ── upload audio ke hosting sementara (coba beberapa host sampai berhasil) ──
async function uploadAudio(buffer) {
    const ft = (await fileTypeFromBuffer(buffer).catch(() => null)) || {}
    const ext = ft.ext || 'mp3'
    const contentType = ft.mime || 'audio/mpeg'
    const filename = `audio.${ext}`
    const opt = (form) => ({
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 60000
    })
    const hosts = [
        ['catbox', async () => {
            const f = new FormData()
            f.append('reqtype', 'fileupload')
            f.append('fileToUpload', buffer, { filename, contentType })
            const r = await axios.post('https://catbox.moe/user/api.php', f, opt(f))
            return String(r.data || '').trim()
        }],
        ['uguu', async () => {
            const f = new FormData()
            f.append('files[]', buffer, { filename, contentType })
            const r = await axios.post('https://uguu.se/upload.php', f, opt(f))
            return r.data?.files?.[0]?.url
        }],
        ['tmpfiles', async () => {
            const f = new FormData()
            f.append('file', buffer, { filename, contentType })
            const r = await axios.post('https://tmpfiles.org/api/v1/upload', f, opt(f))
            return r.data?.data?.url?.replace('tmpfiles.org/', 'tmpfiles.org/dl/')
        }],
        ['qu.ax', async () => {
            const f = new FormData()
            f.append('files[]', buffer, { filename, contentType })
            f.append('expiry', '-1')
            const r = await axios.post('https://qu.ax/upload.php', f, opt(f))
            return r.data?.files?.[0]?.url
        }]
    ]
    const errs = []
    for (const [name, fn] of hosts) {
        try {
            const url = await fn()
            if (isUrl(url)) return url
            errs.push(`${name}: respons kosong`)
        } catch (e) {
            errs.push(`${name}: ${e.response?.status || e.code || e.message}`)
        }
    }
    throw new Error(`Semua hosting upload gagal (${errs.join(', ')})`)
}

// cari URL hasil di respons JSON apa pun bentuknya
function findUrl(obj, depth = 0) {
    if (!obj || depth > 5) return null
    if (typeof obj === 'string') return isUrl(obj) ? obj : null
    if (Array.isArray(obj)) {
        for (const it of obj) { const r = findUrl(it, depth + 1); if (r) return r }
        return null
    }
    if (typeof obj === 'object') {
        for (const k of ['result', 'url', 'output', 'audio', 'data', 'link']) {
            if (k in obj) { const r = findUrl(obj[k], depth + 1); if (r) return r }
        }
        for (const v of Object.values(obj)) { const r = findUrl(v, depth + 1); if (r) return r }
    }
    return null
}

const errText = (d) => {
    if (Buffer.isBuffer(d)) d = d.toString()
    if (typeof d === 'string') return d.slice(0, 300)
    return (d?.message || d?.error || JSON.stringify(d || {})).toString().slice(0, 300)
}

// panggil API cover → { url } atau { buffer }
// urutan percobaan: POST (JSON) → GET; model shortcut pakai /cover/<model> dulu
async function callCover({ audio, model, pitch }) {
    const isShortcut = SHORTCUT.includes(model)
    const q = { apikey: APIKEY }
    const get = (path, params) => () =>
        http.get(`${BASE}${path}`, { params: { ...params, apikey: APIKEY }, responseType: 'arraybuffer' })
    const post = (path, body) => () =>
        http.post(`${BASE}${path}`, body, { params: q, responseType: 'arraybuffer' })

    const attempts = isShortcut
        ? [
            post(`/${model}`, { audio, pitch }),
            get(`/${model}`, { audio, pitch }),
            post('', { audio, model, pitch }),
            get('', { audio, model, pitch, reverb: -1, execType: 'COVER' })
        ]
        : [
            post('', { audio, model, pitch }),
            get('', { audio, model, pitch, reverb: -1, execType: 'COVER' })
        ]

    let lastErr = 'tidak ada respons'
    for (const run of attempts) {
        try {
            const res = await run()
            const buf = Buffer.from(res.data || [])
            const type = String(res.headers?.['content-type'] || '')
            if (res.status >= 400) { lastErr = `API ${res.status}: ${errText(buf)}`; continue }
            if (/^audio\//i.test(type) && buf.length) return { buffer: buf }

            let json
            try { json = JSON.parse(buf.toString()) } catch { lastErr = `Respons tidak dikenali: ${errText(buf)}`; continue }
            if (json?.status === false || json?.success === false || json?.error) { lastErr = errText(json); continue }
            const url = findUrl(json)
            if (url) return { url }
            lastErr = `Hasil tidak ditemukan: ${errText(json)}`
        } catch (e) {
            lastErr = e.code || e.message
        }
    }
    throw new Error(lastErr)
}

async function getModels() {
    const res = await http.get(`${BASE}/models`, { params: { apikey: APIKEY } })
    if (res.status >= 400) throw new Error(`API ${res.status}: ${errText(res.data)}`)
    let d = res.data
    d = d?.result ?? d?.data ?? d?.models ?? d
    if (!Array.isArray(d)) d = Object.values(d || {})
    return d
        .map((x) => (typeof x === 'string' ? x : x?.name || x?.model || x?.id || x?.title))
        .filter(Boolean)
}

let handler = async (m, { sock, text, command, prefix, reply }) => {
    const p = prefix || '.'
    const cmd = (command || '').toLowerCase()

    try {
        // ── daftar model ──
        if (cmd === 'covermodels' || cmd === 'listcover') {
            const list = await getModels()
            if (!list.length) return reply('❌ Daftar model kosong.')
            return reply(
                `🎤 *MODEL AI COVER* (${list.length})\n\n` +
                list.map((x, i) => `${i + 1}. ${x}`).join('\n') +
                `\n\n💡 Reply audio + ${p}aicover <model> [pitch]`
            )
        }

        // ── parse argumen: model, pitch, link ──
        let model = cmd.startsWith('cover') && SHORTCUT.includes(cmd.slice(5)) ? cmd.slice(5) : null
        let pitch = 0
        let audioUrl = null
        for (const t of (text || '').split(/\s+/).filter(Boolean)) {
            if (isUrl(t)) audioUrl = t
            else if (/^[+-]?\d{1,2}$/.test(t)) pitch = Math.max(-12, Math.min(12, parseInt(t)))
            else if (!model) model = t.toLowerCase()
        }
        model = model || DEFAULT_MODEL

        // ── sumber audio: link, atau audio/vn yang dikirim/di-reply ──
        if (!audioUrl) {
            const q = m.quoted?.text?.trim()
            if (isUrl(q)) audioUrl = q
        }
        if (!audioUrl) {
            const pm = pickMedia(m)
            if (!pm || !['audioMessage', 'videoMessage', 'documentMessage'].includes(pm.mtype)) {
                return reply(
                    `🎤 *AI COVER*\n\n` +
                    `Reply audio/vn lalu ketik:\n` +
                    `${p}aicover <model> [pitch]\n` +
                    `${p}aicover patrick https://link-audio.mp3\n\n` +
                    `Shortcut: ${SHORTCUT.map((s) => p + 'cover' + s).join(', ')}\n` +
                    `Daftar model: ${p}covermodels\n` +
                    `Pitch: -12 sampai 12 (default 0)`
                )
            }
            const buf = await pm.download()
            if (!Buffer.isBuffer(buf) || !buf.length) return reply('❌ Gagal mengunduh audio. Kirim ulang.')
            if (buf.length > MAX_AUDIO_MB * 1024 * 1024) return reply(`❌ Audio terlalu besar (maks ${MAX_AUDIO_MB}MB).`)
            await reply('⏳ Mengunggah audio...')
            audioUrl = await uploadAudio(buf)
        }

        await reply(`🎙️ Memproses cover *${model}* (pitch ${pitch})...\nTunggu sebentar, bisa sampai beberapa menit.`)

        const out = await callCover({ audio: audioUrl, model, pitch })
        let audio = out.buffer
        if (!audio) {
            const dl = await axios.get(out.url, { responseType: 'arraybuffer', timeout: 120000 })
            audio = Buffer.from(dl.data)
        }
        if (!audio?.length) throw new Error('Audio hasil kosong')

        await sock.sendMessage(m.chat, { audio, mimetype: 'audio/mpeg', ptt: false }, { quoted: m })
    } catch (e) {
        return reply(`❌ Gagal: ${e?.message || e}`)
    }
}

handler.command = ['aicover', 'cover', 'covermodels', 'listcover', ...SHORTCUT.map((s) => 'cover' + s)]
handler.help = ['aicover <model> [pitch]', 'covermodels', ...SHORTCUT.map((s) => 'cover' + s)]
handler.tags = ['ai']
handler.limit = true

export default handler

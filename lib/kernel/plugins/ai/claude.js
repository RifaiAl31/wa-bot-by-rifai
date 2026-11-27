const BASE_URL = 'https://v2.api-varhad.my.id/ai/claude'
const TIMEOUT = 20_000

export async function askClaude(prompt = 'gw gnteng gk') {
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        throw new Error('Prompt tidak boleh kosong!')
    }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT)

    try {
        const url = `${BASE_URL}?prompt=${encodeURIComponent(prompt.trim())}`
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36'
            },
            signal: controller.signal
        })

        const rawText = await res.text()
        let data = null
        try { data = JSON.parse(rawText) } catch (_) {}

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${data?.message || data?.error || rawText.slice(0, 200)}`)
        }

        return data || { result: rawText }
    } finally {
        clearTimeout(timer)
    }
}

// ambil teks jawaban dari berbagai kemungkinan bentuk respon API
function pickAnswer(data) {
    if (data == null) return ''
    if (typeof data === 'string') return data
    for (const key of ['result', 'answer', 'response', 'data', 'message', 'text', 'content']) {
        const v = data[key]
        if (typeof v === 'string' && v.trim()) return v
        if (v && typeof v === 'object') {
            const inner = pickAnswer(v)
            if (inner) return inner
        }
    }
    return ''
}

let handler = async (m, { text, prefix, command, reply }) => {
    const query = String(text || m.quoted?.text || '').trim()
    if (!query) return reply(`*Contoh:*\n${prefix || '.'}${command} jelaskan cara kerja blockchain`)

    try {
        await m.react?.('⏳')
        const data = await askClaude(query)
        const answer = pickAnswer(data).trim()
        if (!answer) throw new Error('API tidak mengembalikan jawaban.')
        await m.react?.('✅')
        return reply(answer)
    } catch (e) {
        console.error('[CLAUDEAI]', e)
        await m.react?.('❌')
        return reply(`❌ Gagal: ${e?.name === 'AbortError' ? 'Timeout, coba lagi.' : (e?.message || e)}`)
    }
}

handler.command = ['claudeai', 'claude']
handler.help = ['claudeai <pertanyaan>']
handler.tags = ['ai']
handler.limit = true

export default handler

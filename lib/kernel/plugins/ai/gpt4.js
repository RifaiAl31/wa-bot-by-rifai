const BASE_URL = 'https://api.nexadev.my.id/ai/gpt4'
const TIMEOUT = 30_000
const RETRIES = 3
const RETRYABLE_STATUSES = new Set([403, 408, 429, 500, 502, 503, 504])

const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
]

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function getHeaders(attemptIndex) {
    return {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'User-Agent': USER_AGENTS[attemptIndex % USER_AGENTS.length]
    }
}

export async function askGpt4(prompt) {
    if (!prompt || typeof prompt !== 'string') {
        throw new Error('Pertanyaan/prompt wajib diisi!')
    }

    const url = new URL(BASE_URL)
    url.searchParams.set('q', prompt.trim())

    let lastError = null

    for (let attempt = 0; attempt <= RETRIES; attempt++) {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), TIMEOUT)

        try {
            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: getHeaders(attempt),
                signal: controller.signal
            })

            const rawText = await response.text()
            let data = null
            try { data = JSON.parse(rawText) } catch (_) {}

            if (RETRYABLE_STATUSES.has(response.status) && attempt < RETRIES) {
                await sleep(1500 * Math.pow(2, attempt))
                continue
            }

            if (!response.ok) {
                throw new Error(data?.message || data?.error || `HTTP ${response.status}`)
            }

            return data || { result: rawText }
        } catch (err) {
            lastError = err
            if (attempt < RETRIES) await sleep(1500 * Math.pow(2, attempt))
        } finally {
            clearTimeout(timer)
        }
    }

    throw lastError || new Error('Request ke GPT-4 AI gagal.')
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
    if (!query) return reply(`*Contoh:*\n${prefix || '.'}${command} buatkan puisi tentang hujan`)

    try {
        await m.react?.('⏳')
        const data = await askGpt4(query)
        const answer = pickAnswer(data).trim()
        if (!answer) throw new Error('API tidak mengembalikan jawaban.')
        await m.react?.('✅')
        return reply(answer)
    } catch (e) {
        console.error('[GPT4]', e)
        await m.react?.('❌')
        return reply(`❌ Gagal: ${e?.name === 'AbortError' ? 'Timeout, coba lagi.' : (e?.message || e)}`)
    }
}

handler.command = ['gpt4', 'nexagpt']
handler.help = ['gpt4 <pertanyaan>']
handler.tags = ['ai']
handler.limit = true

export default handler

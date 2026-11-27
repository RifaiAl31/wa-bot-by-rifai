const CACHE_TTL = 60000
const MAX_RETRIES = 3
const RETRY_DELAYS = [3000, 6000, 12000]

// cache per nomor bot: bot utama dan tiap jadibot punya daftar grup sendiri (sebelumnya satu cache dipakai bersama,
// jadi JPM jadibot bisa terkirim ke grup milik bot utama)
const caches = new Map()
const cacheKey = (sock) => String(sock?.user?.id || sock?.user?.lid || 'main').split('@')[0].split(':')[0]

async function fetchGroupsSafe(sock) {
    const now = Date.now()
    const key = cacheKey(sock)
    const hit = caches.get(key)
    if (hit && (now - hit.at) < CACHE_TTL) {
        return hit.groups
    }

    global.isFetchingGroups = true

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const result = await sock.groupFetchAllParticipating()
            caches.set(key, { groups: result, at: Date.now() })
            global.isFetchingGroups = false
            return result
        } catch (err) {
            const isRateLimit = err.message?.includes('rate') ||
                err.message?.includes('limit') ||
                err.message?.includes('429') ||
                err.output?.statusCode === 429

            if (isRateLimit && attempt < MAX_RETRIES - 1) {
                const delay = RETRY_DELAYS[attempt]
                await new Promise(resolve => setTimeout(resolve, delay))
                continue
            }

            global.isFetchingGroups = false
            throw err
        }
    }

    global.isFetchingGroups = false
    throw new Error('Gagal fetch groups setelah beberapa percobaan')
}

function clearGroupCache() {
    caches.clear()
}

module.exports = { fetchGroupsSafe, clearGroupCache }

// Kelola pilihan notifikasi Telegram untuk pengguna yang pernah /start.

import fs from 'node:fs'
import path from 'node:path'

const FILE = path.join(process.cwd(), 'database', 'tg-subscribers.json')

let cache = null
let timer = null

const flush = () => {
    timer = null
    try {
        fs.mkdirSync(path.dirname(FILE), { recursive: true })
        const tmp = FILE + '.tmp'
        fs.writeFileSync(tmp, JSON.stringify({ _meta: { desc: 'Pengaturan notifikasi Telegram pengguna' }, users: cache.users }, null, 2))
        fs.renameSync(tmp, FILE)
    } catch (e) { console.error('[ TG-SUBSCRIBERS ] gagal simpan:', e?.message || e) }
}
const save = () => { if (!timer) timer = setTimeout(flush, 500) }
process.on('exit', () => { if (timer) { clearTimeout(timer); flush() } })

const load = () => {
    if (cache) return cache
    cache = { users: {} }
    try {
        const j = JSON.parse(fs.readFileSync(FILE, 'utf8'))
        if (j?.users && typeof j.users === 'object') cache.users = j.users
    } catch {}
    return cache
}

/** Catat user yang /start (chat pribadi saja). Mengaktifkan lagi kalau sebelumnya /stop. */
export function addSubscriber(from, chat) {
    if (!from?.id || chat?.type !== 'private' || from.is_bot) return false
    const d = load()
    const id = String(chat.id)
    const cur = d.users[id]
    d.users[id] = {
        id, name: [from.first_name, from.last_name].filter(Boolean).join(' ') || from.username || '', username: from.username || '',
        since: cur?.since || Date.now(), active: true
    }
    save()
    return !cur || cur.active === false
}

/** User mematikan notifikasi (/stop). */
export function removeSubscriber(chatId) {
    const d = load()
    const cur = d.users[String(chatId)]
    if (!cur || cur.active === false) return false
    cur.active = false
    cur.stoppedAt = Date.now()
    save()
    return true
}

export const countSubscribers = () => Object.values(load().users).filter(u => u.active !== false).length

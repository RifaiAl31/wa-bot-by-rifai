// Bersihkan sesi enkripsi yang rusak (penyebab "Bad MAC") TANPA logout. creds.json tetap aman.
// Pakai saat bot MATI:  node clean-session.js
const fs = require('fs')
const path = require('path')
const config = require('./config')
const { alive } = require('./lib/singleton')

const dir = path.join(__dirname, config.sessionDir)
const lock = path.join(dir, '.bot.pid')

try {
  const pid = Number(fs.readFileSync(lock, 'utf8'))
  if (pid && alive(pid)) {
    console.log(`Bot masih berjalan (PID ${pid}). Hentikan dulu (Ctrl+C / pm2 stop), baru jalankan skrip ini.`)
    process.exit(1)
  }
} catch {}

if (!fs.existsSync(dir)) {
  console.log('Folder session tidak ditemukan.')
  process.exit(0)
}
const remove = fs.readdirSync(dir).filter((f) => /^(session-|sender-key-|sender-key-memory-).*\.json$/.test(f))
for (const f of remove) fs.rmSync(path.join(dir, f), { force: true })
console.log(`Selesai: ${remove.length} file sesi dihapus. creds.json dan kunci lain tetap utuh.`)
console.log('Jalankan bot lagi. Sesi dibuat ulang otomatis saat ada pesan masuk (beberapa pesan pertama bisa tertunda).')

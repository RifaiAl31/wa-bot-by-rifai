# WhatsApp Bot vanXone v7 — By Rifai

Bot WhatsApp berbasis Baileys (CommonJS) dengan plugin, game, downloader, AI, dan pengelolaan grup.

> Baileys adalah integrasi WhatsApp Web tidak resmi dan tidak berafiliasi dengan WhatsApp. Gunakan nomor cadangan/khusus bot.

## Menjalankan

Butuh Node.js >= 20.19.

```bash
npm install
cp .env.example .env
# isi kunci API di .env sesuai kebutuhan
npm start
```

Jalankan tes dengan `npm test`.

## Konfigurasi

Seluruh pengaturan ada di `settings.js`. Nilai kunci rahasia dibaca dari file `.env` lokal
yang **tidak ikut di-commit**. Jika `.env` tidak ada, kunci bernilai kosong dan fitur
terkait tidak aktif — bot tetap bisa berjalan.

File `.env`, `session/`, `database/`, dan `bin/cookies.txt` sengaja tidak disertakan di
repo karena berisi data privat/sesi login. Semua akan dibuat ulang oleh bot saat dijalankan,
kecuali `.env` yang perlu Anda salin dari `.env.example`.

## Struktur singkat

- `bot.js` — entry point bot
- `settings.js` — pengaturan & kunci (dari `.env`)
- `plugins/` — fitur per kategori
- `lib/` — helper, adapter, dan aset
- `database/` — data runtime (diabaikan Git)
- `session/` — sesi Baileys (diabaikan Git)

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

## Download audio YouTube/TikTok

Command `.ytmp3 <link-youtube>` dan `.ttmp3 <link-tiktok>` memproses tautan publik
menjadi MP3. `.mp3 <link>` mendeteksi platform otomatis. Fitur ini memakai yt-dlp lokal
(diunduh otomatis dari rilis resmi saat pertama digunakan) dan FFmpeg; tidak memerlukan
API key atau layanan downloader berbayar. Downloader tidak menggunakan cookies, login,
atau proxy untuk membuka konten yang dibatasi. Gunakan hanya untuk audio yang Anda miliki
haknya atau diizinkan untuk diunduh.

Command `.mp3` tanpa tautan tetap dapat digunakan untuk mengonversi media yang dikirim/dibalas,
seperti sebelumnya.

Pasang FFmpeg sesuai distro:

```bash
# Debian/Ubuntu
sudo apt-get update && sudo apt-get install -y ffmpeg

# Alpine Linux
apk add --no-cache ffmpeg

# If the bundled yt-dlp binary is incompatible with Alpine/musl:
apk add --no-cache python3 py3-pip
python3 -m venv /opt/yt-dlp
/opt/yt-dlp/bin/pip install -U yt-dlp
```

For the Alpine virtual environment, set `global.downloader.ytdlp.path` in
`settings.js` to `/opt/yt-dlp/bin/yt-dlp`.
Pastikan server dapat mengakses `github.com` agar yt-dlp dapat dipasang otomatis.
Fitur membatasi durasi hingga 15 menit, ukuran hasil hingga 25 MB, waktu proses hingga
4 menit, serta maksimal dua proses bersamaan. Contoh:

```text
.ytmp3 https://www.youtube.com/watch?v=VIDEO_ID
.ttmp3 https://www.tiktok.com/@user/video/VIDEO_ID
.mp3 https://youtu.be/VIDEO_ID
```

## Struktur singkat

- `bot.js` — entry point bot
- `settings.js` — pengaturan & kunci (dari `.env`)
- `plugins/` — fitur per kategori
- `lib/` — helper, adapter, dan aset
- `database/` — data runtime (diabaikan Git)
- `session/` — sesi Baileys (diabaikan Git)

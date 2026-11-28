# Asisten Sekretaris Digital (vanXone v7)

Fitur: analisis foto catatan rapat tulisan tangan + Auto Pengumuman WhatsApp.

## Perintah

Analisis catatan:
- Kirim foto dengan caption `.analisis-catatan`, atau balas foto dengan `.analisis-catatan`.
- Kirim foto lagi untuk halaman berikutnya, lalu ketik `selesai`.
- Setelah hasil tampil: `.ya` menyimpan, `.edit 4 <teks>` mengoreksi kategori 4, `.edit tambah 1 <teks>` menambah butir, `.batal` membuang.

Arsip catatan:
- `.catatan list`
- `.catatan detail CAT001`
- `.catatan hapus CAT001`
- `.catatan cari <kata>`
- `.catatan pengumuman CAT001` → pilih nomor kategori 1–10; judul & isi otomatis diisi dari arsip ke wizard Auto Pengumuman.

Auto Pengumuman:
- `.auto-pengumuman` (ringkasan + daftar + status + panduan)
- `.auto-pengumuman tambah` (wizard)
- `.auto-pengumuman list`
- `.auto-pengumuman detail AN1`
- `.auto-pengumuman hapus AN1`
- `.auto-pengumuman pause AN1`
- `.auto-pengumuman resume AN1`
- `.auto-web` (tautan dashboard; admin saja — `.auto-web set <url>` untuk menyimpan URL Vercel dari WA)
- `.auto-pengumuman bot` (alias lama `.auto-web`)

Sistem Hybrid WhatsApp + Web Dashboard (login admin, CRUD, upload gambar, preview, jadwal sekali/relatif, template, riwayat, retry aman) ada di `docs/AUTO_PENGUMUMAN_HYBRID.md`. Frontend bisa di-host gratis di Vercel; bot/API tetap di VPS karena Baileys butuh proses permanen.

Wizard `.auto-pengumuman tambah` bertanya berurutan:
hari → tanggal (atau `depan`) → judul → isi → jam kegiatan → pilihan kirim (1=7 hari sebelum, 2=1 hari sebelum, 3=hari kegiatan) → jam kirim → pengulangan (1=sekali, 2=tiap minggu) → format (1=teks, 2=poster, 3=teks+poster) → grup tujuan → konfirmasi.
Jawaban diketik sebagai pesan biasa. Saat konfirmasi: `ya`, `batal`, atau `edit judul <teks>` / `edit isi <teks>` / `edit jam HH.mm` / `edit kirim HH.mm` / `edit format 1|2|3` / `edit ulang 1|2` / `edit grup ini|semua|<nomor>`.

## Provider AI vision (wajib diatur)

Pada pengecekan langsung, `global.geminikey` yang tersedia di `settings.js` menghasilkan HTTP 401 (API key tidak valid), jadi analisis tulisan tangan belum bisa dijalankan sampai kunci/endpoint diganti. Tidak ada API vision lokal yang terpasang. Tesseract.js ada, tetapi paket bahasa belum terunduh dan OCR biasa tidak memenuhi syarat ketelitian.

Pilihan (pilih salah satu):

1. Gemini gratis: buat kunci di https://aistudio.google.com/apikey, lalu set environment `GEMINI_API_KEY` sebelum `npm start`, atau ganti `global.geminikey` di `settings.js`. Kuota gratis tersedia; cek batas terbaru di halaman provider. Jangan menempelkan kunci di chat.
2. Ollama/LM Studio lokal (tanpa biaya API): jalankan model vision seperti `qwen2.5vl`, lalu set:
   - `NOTE_VISION_URL=http://127.0.0.1:11434/v1`
   - `NOTE_VISION_MODEL=qwen2.5vl:7b` (sesuaikan nama model yang terpasang)
   - opsional `NOTE_VISION_KEY` bila endpoint meminta auth.
   Endpoint harus kompatibel `/chat/completions`.

Prioritas: endpoint lokal dipakai lebih dulu bila `NOTE_VISION_URL` diisi, baru Gemini. `NOTE_VISION_GEMINI_MODEL` dan `NOTE_VISION_TIMEOUT_MS` tersedia untuk penyesuaian; batas halaman adalah 10 per sesi (`lib/noteFlow.js`).

Aturan ketelitian ada di prompt `lib/noteVision.js`: tidak mengarang nama/tanggal/nominal, `[TIDAK TERBACA]` untuk bagian yang tak terbaca, dua bacaan ditampilkan keduanya, dan `tertulis` dipisah dari `interpretasi`.

## Penyimpanan dan penjadwalan

- `database/auto-announcements.json` — agenda AN1, AN2, ... tanpa batas + catatan klaim pengiriman (anti-double).
- `database/catatan-rapat.json` — arsip CAT001, CAT002, ...
- `database/announcement-media/` — foto halaman yang disimpan.
- Zona waktu `Asia/Jakarta`. Scheduler memakai loop 10 detik yang sudah ada (`lib/scheduler.js`); tidak ada timer kedua. Jadwal tidak diklaim saat WhatsApp offline.
- Poster PNG 1080×1350 dibuat lokal dengan `@napi-rs/canvas` (`lib/autoAnnouncementPoster.js`), tanpa API berbayar.

## Integrasi ke bot

Perubahan pada `lib/scheduler.js` hanya menambahkan satu blok `try/catch` yang memanggil `tickAutoAnnouncements(sock)` di dalam `tick()` yang sudah ada. Plugin baru:

- `plugins/tools/auto-pengumuman.js` (menggantikan versi lama yang hanya menerima format pipa)
- `plugins/tools/analisis-catatan.js`
- `plugins/tools/catatan.js` (command `catatan-rapat`)
- `plugins/group/auto-pengumuman-hook.js`
- `plugins/group/analisis-catatan-hook.js`

Hook terakhir juga mengambil alih `.catatan <sub>` karena `.catatan` (tanpa sub) dimiliki plugin `plugins/image/katabgwindah.js`.

## Verifikasi

`cd /home/rifai/Downloads/vanxone_v7 && npm test` → 23 tes lulus (termasuk wizard, anti-double, multi-halaman, provider palsu, dan generasi poster).

Menjalankan bot: `cd /home/rifai/Downloads/vanxone_v7 && npm start`. QR login dan pengiriman ke grup nyata tidak bisa diverifikasi otomatis; lakukan dari HP Anda.

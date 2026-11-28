# Auto Pengumuman Hybrid — WhatsApp + Web Dashboard

Fitur ini **mengembangkan** sistem `.auto-pengumuman` yang sudah ada di project ini. Tidak ada project baru, tidak ada koneksi WhatsApp kedua, dan tidak ada database kedua: WhatsApp command, scheduler, dan dashboard memakai satu proses, satu socket Baileys, dan satu file `database/auto-announcements.json`.

## Arsitektur (penting soal Vercel)

```
HP admin ──> WhatsApp (sock yang sama) ─┐
                                        ├─> lib/autoAnnouncementData.js ─> database/auto-announcements.json
Browser ───> Vercel (frontend statis) ──┤                                  (sama untuk WA + web)
              web/api/[...path].js      │
              proxy /api ───────────────┘──> VPS: bot.js + HTTP server (port DASHBOARD_PORT)
                                                     └─> sock.__rawSend → grup WhatsApp
```

**Bot tidak bisa dijalankan di Vercel free.** Baileys butuh proses permanen, folder session, dan filesystem yang tidak hilang saat deploy. Vercel hanya dipakai untuk frontend + proxy `/api`. Proses bot tetap di VPS/Railway/Render (long-lived) dengan volume persisten. Jangan coba memindahkan `bot.js` ke serverless.

## 1. Instalasi di VPS (bot + API)

Tidak ada dependency baru; server memakai `node:http` bawaan Node.

```bash
cd /home/rifai/Downloads/vanxone_v7
cp .env.example .env
# isi DASHBOARD_PASSWORD (min. 8 karakter) dan variabel lain di bawah
npm test
npm start          # atau: pm2 restart "WhatsApp Bot"
```

Variabel `.env` untuk dashboard:

| Variabel | Wajib | Fungsi |
|---|---|---|
| `DASHBOARD_PASSWORD` | Ya | Password login admin. Tanpa ini login ditolak. Jangan commit. |
| `DASHBOARD_PORT` | Tidak | Default `3000`. Satu port untuk dashboard + API. |
| `DASHBOARD_HOST` | Tidak | Default `0.0.0.0`. |
| `DASHBOARD_PUBLIC_URL` | Ya untuk WA | URL dashboard yang dikirim `.auto-pengumuman bot`. |
| `DASHBOARD_ALLOWED_ORIGIN` | Ya untuk Vercel | Origin frontend, cth `https://nama-app.vercel.app`. |
| `DASHBOARD_COOKIE_SAME_SITE` | Ya untuk Vercel | `none` saat frontend & backend beda origin melalui proxy. |
| `DASHBOARD_COOKIE_SECURE` | Ya untuk Vercel | `1` (wajib bila SameSite=none). |
| `DASHBOARD_SESSION_SECRET` | Disarankan | Rahasia HMAC session; bila kosong dibuat otomatis di `database/dashboard-auth.json`. |
| `DASHBOARD_SESSION_HOURS` | Tidak | Default 8 jam. |
| `DASHBOARD_UPLOAD_MAX_MB` | Tidak | Default 5 MB. |
| `DASHBOARD_ENABLED` | Tidak | `0` = matikan dashboard. |
| `SKIP_WHATSAPP` | Tidak | `1` = dashboard saja, WhatsApp tidak dijalankan (perawatan). |

Akses lokal: `http://IP-VPS:3000/dashboard`. Untuk produksi, pasang HTTPS (Cloudflare Tunnel / nginx + Let's Encrypt) dan set `DASHBOARD_PUBLIC_URL` ke URL publik itu, atau ke URL Vercel bila memakai frontend Vercel.

## 2. Deploy frontend ke Vercel free

1. Push repository ke GitHub (file `.env`, `session/`, `database/`, `node_modules/` sudah ada di `.gitignore`).
2. di Vercel → **Add New → Project** → pilih repo → **Root Directory: `web`** → Framework: **Other/None** → Deploy.
3. Environment variable Vercel (Project Settings → Environment Variables):
   - `BACKEND_URL = https://<domain-atau-tunnel-vps>` (tanpa `/api`; **HTTPS**, tidak boleh `http://` karena halaman Vercel HTTPS).
4. Di VPS, set `DASHBOARD_ALLOWED_ORIGIN=https://<nama-app>.vercel.app`, `DASHBOARD_COOKIE_SAME_SITE=none`, `DASHBOARD_COOKIE_SECURE=1`, `DASHBOARD_PUBLIC_URL=https://<nama-app>.vercel.app`, lalu restart bot.

`web/api/[...path].js` meneruskan semua `/api/*` ke VPS, termasuk cookie HttpOnly dan header `x-csrf-token`. `BACKEND_URL` hanya ada di sisi server Vercel, tidak pernah dikirim ke browser. Frontend tidak menyimpan password, token, session Baileys, atau kredensial bot.

Jika `BACKEND_URL` kosong, proxy mengembalikan 502 dengan pesan konfigurasi. Jika VPS sedang mati, dashboard tetap tampil tapi kirim manual/retry akan gagal dengan jelas (tidak ada jadwal yang diklaim).

## 3. Command WhatsApp (fitur lama tetap ada)

| Command | Fungsi |
|---|---|
| `.auto-pengumuman` | Ringkasan jumlah agenda + daftar/status + panduan command. |
| `.auto-pengumuman tambah` | Wizard percakapan WhatsApp (hari → tanggal → judul → isi → jam kegiatan → waktu kirim → jam kirim → ulang → format → grup → `ya`). |
| `.auto-pengumuman list` | Semua agenda beserta statusnya. |
| `.auto-pengumuman detail AN1` | Detail + isi lengkap. |
| `.auto-pengumuman hapus AN1` | Hapus agenda. |
| `.auto-pengumuman pause AN1` / `resume AN1` | Jeda/aktifkan agenda. |
| `.auto-pengumuman bot` | Alias lama; sama dengan `.auto-web`. |
| `.auto-web` | **Admin/owner/group admin**: tautan dashboard. Jika URL belum diatur, perintah ini memberi cara menyetelnya. |
| `.auto-web set https://nama-project.vercel.app` | Admin: simpan URL dashboard dari WhatsApp (tanpa edit `.env`). Tersimpan di `database/dashboard-url.json`. |
| `.auto-web status` | Admin: lihat sumber URL (`.env` atau WhatsApp) dan tautan akhir. |
| `.auto-web reset` | Admin: hapus URL yang pernah diset dari WhatsApp. |

URL dashboard diambil berurutan dari `DASHBOARD_PUBLIC_URL`, `DASHBOARD_VERCEL_URL`, lalu file hasil `.auto-web set`. Ini mengatasi masalah tautan `localhost` bila `.env` belum diisi. Tetap set `DASHBOARD_PASSWORD` di VPS agar login dashboard aktif.

Wizard masih menerima `batal`, `ya`, dan `edit judul|isi|jam|kirim|format|ulang|grup|tanggal` seperti sebelumnya. Pengumuman yang dibuat dari WhatsApp langsung muncul di dashboard, dan sebaliknya, karena keduanya membaca file yang sama.

## 4. Fitur dashboard

- Statistik: total, aktif, draft, terjadwal, pending, berhasil, gagal + status koneksi WhatsApp (nomor disamarkan).
- Tambah/edit/hapus pengumuman; simpan sebagai draft atau langsung aktif.
- Upload gambar/poster JPG/PNG/WebP maks 5 MB (validasi magic bytes, bukan hanya ekstensi).
- Preview pesan WhatsApp persis sebelum dikirim (baris tanggal/kegiatan/lokasi + isi; detail jadwal ditandai tidak ikut terkirim).
- Jadwal dua mode: relatif (7/1/0 hari sebelum kegiatan + jam kirim, bisa mingguan) atau sekali (`YYYY-MM-DDTHH:mm` WIB).
- Pilih grup penerima (daftar diambil dari socket bot yang sedang berjalan), kirim sekarang, retry run gagal.
- Riwayat pengiriman dengan status `claimed` (pending) / `sent` / `failed` dan detail per grup.
- Template pengumuman (tambah/edit/hapus/pakai).
- Log audit aktivitas admin (login, logout, CRUD, upload, kirim, retry) tanpa password/token.

## 5. Keamanan dan pengiriman

- Login password → hash scrypt + salt lokal; session berupa cookie HttpOnly bertanda-tangan HMAC, TTL 8 jam; CSRF token wajib untuk setiap mutasi; rate limit 5 gagal/15 menit per IP; origin divalidasi bila dikonfigurasi.
- Semua input divalidasi di server (tanggal, jam, format, target `@g.us`, ukuran & tipe gambar, path upload).
- Antar-pressure ganda: satu `run` hanya bisa diklaim sekali (`claimRun`/`claimUnique`); retry hanya untuk run gagal; pengiriman manual/retry memakai kunci unik. Pengiriman dibatalkan bila WhatsApp offline, tanpa menulis klaim yang hilang.
- Scheduler tetap memakai loop 10 detik yang lama di `lib/scheduler.js`; tidak ada timer kedua dan tidak ada socket kedua. Pengiriman lewat `sock.__rawSend`, bukan kartu richui.
- Data lama tidak dihapus: field baru (`status`, `mode`, `scheduleAt`, `location`, `imagePath`, `templates`, `audit`) ditambahkan dengan default. Backup `database/auto-announcements.json` sebelum upgrade bila ingin berjaga.

## 6. Pengujian

```bash
cd /home/rifai/Downloads/vanxone_v7 && npm test
```

Tes baru `tests/auto-pengumuman-web.test.js` menjalankan HTTP server asli pada port ephemeral dengan socket WhatsApp palsu: login/CSRF, CRUD, upload, kirim manual, offline, retry, anti-double, template, dan audit. QR login asli dan pengiriman ke grup nyata tidak bisa diotomatisasi — lakukan dari HP Anda setelah deploy.

Perawatan tanpa mengganggu bot yang sedang jalan (jangan kill bot live):

```bash
cp database/auto-announcements.json /tmp/auto-ann-copy.json
AUTO_ANNOUNCEMENT_DATA_DIR=/tmp DASHBOARD_PORT=3001 SKIP_WHATSAPP=1 npm start
# lalu buka http://localhost:3001/dashboard , hentikan hanya proses ini
```

## 7. Pemecahan masalah

| Gejala | Penyebab / tindakan |
|---|---|
| Login bilang "belum dikonfigurasi" | `DASHBOARD_PASSWORD` kosong atau < 8 karakter. Isi lalu restart bot. |
| 401 setelah deploy Vercel | Cookie `Secure`/`SameSite=None` belum diset, atau `BACKEND_URL` salah. |
| 403 saat simpan | CSRF token hilang — muat ulang halaman dashboard. |
| 409 "WhatsApp sedang terputus" | Sesi/login WhatsApp putus; tidak ada pengiriman yang diklaim. Tunggu bot reconnect. |
| 502 dari Vercel | VPS/tunnel tidak bisa dijangkau atau `BACKEND_URL` belum diisi. |
| Daftar grup kosong | Socket belum `connected` atau `groupFetchAllParticipating` gagal; dashboard memakai `namedGroups` sebagai cadangan. |

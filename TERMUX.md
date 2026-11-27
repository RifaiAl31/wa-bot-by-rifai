# Menjalankan bot di Termux / Android

Ada dua jalur. **Jalur A (proot-distro Ubuntu) direkomendasikan** kalau mau semua
fitur jalan: lingkungannya glibc seperti VPS, sehingga dependency native
(`sharp`, `@napi-rs/canvas`, `better-sqlite3`, `ffmpeg`) memakai binary prebuilt
yang normal. Jalur B (Termux native) lebih ringan tetapi beberapa modul harus
dikompile dan tidak selalu berhasil.

Termux yang dipakai harus versi F-Droid / GitHub Releases, bukan versi Play Store.

---

## Jalur A — Ubuntu di dalam Termux (paling lengkap)

### 1. Siapkan container Ubuntu

Di Termux:

```sh
pkg update && pkg upgrade -y
pkg install -y proot-distro git curl
proot-distro install ubuntu
proot-distro login ubuntu
```

### 2. Pasang toolchain dan Node 24 di dalam Ubuntu

Masih di dalam Ubuntu (`root@localhost:~#`):

```sh
apt update && apt upgrade -y
apt install -y curl ca-certificates git build-essential python3 ffmpeg tmux

curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt install -y nodejs

node -v   # harus >= v20.19
npm -v
```

Kalau NodeSource gagal, pakai nvm:

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
. ~/.bashrc
nvm install 24
nvm alias default 24
```

### 3. Ambil projekt dan siapkan kunci

```sh
cd ~
git clone https://github.com/RifaiAl31/wa-bot-by-rifai.git
cd wa-bot-by-rifai
cp .env.example .env
nano .env
```

Isi kunci API yang dipakai. Untuk login pertama tambahkan juga:

```
PAIRING_NUMBER=628xxxxxxxxx
```

(ganti nomor WhatsApp yang akan dipakai bot, tanpa `+` / spasi).

File `.env` tidak ikut ter-commit. Jangan pernah commit atau bagikan file ini.

### 4. Pasang dependency lengkap

```sh
npm install --legacy-peer-deps --no-audit --no-fund
```

Ini bisa memakan waktu lama dan butuh ruang penyimpanan besar (sekitar 1–2 GB
ditambah ruang untuk container). Modul opsional yang gagal hanya membuat fitur
terkait tidak aktif; dependency inti tetap terpasang.

Cek modul native:

```sh
node -e "require('sharp'); console.log('sharp OK')"
node -e "require('@napi-rs/canvas'); console.log('canvas OK')"
node -e "require('better-sqlite3'); console.log('sqlite OK')"
ffmpeg -version | head -1
```

### 5. Pairing pertama kali

```sh
npm start
```

Akan keluar kode pairing 8 digit. Di WhatsApp: **Perangkat Tertaut >
Tautkan dengan nomor telepon > masukkan kode**. Setelah tersambung, sesi
tersimpan di folder `session/` dan pairing tidak perlu diulang saat restart.

Kalau lupa mengisi `PAIRING_NUMBER`, bot menanyakan nomor di console.

### 6. Jalan terus seperti server (tmux)

Di dalam Ubuntu:

```sh
tmux new -s wa
cd ~/wa-bot-by-rifai && npm start
```

- Detach: tekan `Ctrl+b`, lalu `d`
- Masuk lagi: `tmux attach -t wa`
- Matikan sesi: `tmux kill-session -t wa`

Di Termux (luar container) jalankan `termux-wake-lock` agar CPU tidak tidur.
Matikan dengan `termux-wake-unlock`.

### 7. Auto-start saat HP reboot

Pasang aplikasi **Termux:Boot** dari F-Droid, lalu di Termux:

```sh
mkdir -p ~/.termux/boot
nano ~/.termux/boot/boot-wa.sh
```

Isi:

```sh
#!/data/data/com.termux/files/usr/bin/sh
termux-wake-lock
proot-distro login ubuntu -- tmux new -d -s wa "cd /root/wa-bot-by-rifai && npm start"
```

Lalu:

```sh
chmod +x ~/.termux/boot/boot-wa.sh
```

Pastikan battery optimization / Doze dimatikan untuk Termux, kalau tidak Android
boleh mematikan proses meski `termux-wake-lock` aktif. Butuh RAM minimal ~1 GB.

### 8. Update projekt

```sh
cd ~/wa-bot-by-rifai
git pull
npm install --legacy-peer-deps
tmux kill-session -t wa
tmux new -s wa -d "cd /root/wa-bot-by-rifai && npm start"
```

`.env`, `session/`, dan `database/` tidak akan ditimpa oleh `git pull`.

---

## Jalur B — Termux native (alternatif)

Semua modul try / paksa build dari source. Tidak ada jaminan 100% untuk
`skia-canvas`, `mupdf`, atau Chromium-nya `puppeteer`, tetapi fitur inti,
gambar, dan database biasanya bisa.

```sh
pkg update && pkg upgrade -y
pkg install -y x11-repo
pkg install -y nodejs-lts git curl tmux build-essential python make clang \
  pkg-config libpixman libcairo pango libjpeg-turbo giflib xorgproto \
  libvips ffmpeg rust

export PKG_CONFIG_PATH=$PREFIX/lib/pkgconfig
export SHARP_FORCE_GLOBAL_LIBVIPS=1

cd ~
git clone https://github.com/RifaiAl31/wa-bot-by-rifai.git
cd wa-bot-by-rifai
cp .env.example .env
nano .env

npm_config_build_from_source=true npm install --legacy-peer-deps --no-audit --no-fund
```

`lib/ffm.js` otomatis memakai `ffmpeg` dari PATH, jadi `pkg install ffmpeg`
sudah cukup untuk fitur audio/video.

Kalau instalasi penuh gagal:

```sh
npm install --omit=optional --legacy-peer-deps --no-audit --no-fund
```

Lalu pasang satu per satu modul yang benar-benar dipakai, misalnya:

```sh
npm_config_build_from_source=true npm install @napi-rs/canvas sharp better-sqlite3 --legacy-peer-deps
```

Jalankan seperti Jalur A, tapi tmux dan autostart-nya langsung di Termux:

```sh
termux-wake-lock
tmux new -s wa
cd ~/wa-bot-by-rifai && npm start
```

Script `~/.termux/boot/boot-wa.sh`:

```sh
#!/data/data/com.termux/files/usr/bin/sh
termux-wake-lock
tmux new -d -s wa "cd $HOME/wa-bot-by-rifai && npm start"
```

---

## Masalah umum

| Gejala | Penyebab / solusi |
| --- | --- |
| `pkg: command not found` / permission error | Termux versi Play Store. Pakai versi F-Droid. |
| `node -v` < 20.19 | `pkg install nodejs-lts` (Jalur B) atau pasang Node 24 (Jalur A). |
| Error panjang `node-gyp` saat `better-sqlite3` | Toolchain belum ada: pasang `build-essential python make clang`. |
| `sharp` gagal download binary | Paksa build: `npm_config_build_from_source=true` + `pkg install libvips`. |
| Bot konek lalu putus sendiri | HP mematikan proses. Aktifkan `termux-wake-lock` dan matikan battery optimization untuk Termux. |
| Kode pairing tidak muncul | Isi `PAIRING_NUMBER` di `.env`, lalu hapus folder `session/` dan jalankan ulang. |
| Paket inti belum terpasang | Bot punya auto-install; pastikan RAM/disk cukup lalu `npm start` lagi. |

// AI vision untuk catatan rapat tulisan tangan.
// Provider: endpoint OpenAI-compatible lokal (Ollama/LM Studio, gratis) atau Gemini.
// Kunci dibaca dari env / settings.js; tidak pernah ditulis ke file atau log.
'use strict'

const CATEGORIES = [
  ['judul_dan_tanggal', '1. Judul dan tanggal rapat'],
  ['hasil_musyawarah', '2. Hasil musyawarah'],
  ['jadwal_kegiatan', '3. Jadwal kegiatan'],
  ['daftar_nama_dan_petugas', '4. Daftar nama dan petugas'],
  ['pembagian_kelompok', '5. Pembagian kelompok'],
  ['tugas_masing_orang', '6. Tugas masing-masing orang'],
  ['informasi_keuangan', '7. Informasi keuangan'],
  ['rencana_kegiatan', '8. Rencana kegiatan'],
  ['catatan_tambahan', '9. Catatan tambahan'],
  ['perlu_konfirmasi', '10. Bagian yang perlu dikonfirmasi'],
]

const UNREADABLE = '[TIDAK TERBACA]'

function systemInstruction() {
  return [
    'Kamu adalah asisten sekretaris yang membaca foto catatan rapat tulisan tangan di buku.',
    'Tugasmu： transkripsi setia, BUKAN menebak dan BUKAN merangkai cerita.',
    'Aturan mutlak:',
    '1. Jangan mengarang nama, tanggal, jam, nominal uang, keputusan, atau isi apa pun yang tidak terbaca jelas.',
    '2. Jangan mengubah nominal uang, ejaan istilah asli, atau isi keputusan rapat. Salin apa adanya.',
    '3. Bagian yang tidak terbaca TULIS PERSIS ' + UNREADABLE + '. Jangan diganti dengan perkiraan.',
    '4. Jika suatu tulisan punya dua kemungkinan bacaan, tampilkan keduanya dengan format "X (atau: Y)" dan masukkan ke perlu_konfirmasi.',
    '5. Bedakan fakta tertulis dari interpretasi. Masukkan fakta ke kunci "tertulis", deduksi/ringkasan ke kunci "interpretasi". Jangan pernah memindahkan interpretasi ke "tertulis".',
    '6. Jika kategori tidak ada dalam catatan, isi dengan array kosong. Jangan mengisi dengan teks umum.',
    '7. Tulisan kecil dan kurang rapi tetap dibaca huruf demi huruf; gunakan konteks hanya untuk memilih di antara dua bacaan yang memang terlihat.',
    '8. Urutan halaman harus dipertahankan. Beri label HALAMAN 1, HALAMAN 2, dan seterusnya sesuai urutan gambar yang dikirim.',
    '9. Kembalikan HANYA objek JSON valid, tanpa markdown, tanpa penjelasan di luar JSON.',
    '',
    'Struktur JSON wajib:',
    JSON.stringify({
      judul_dan_tanggal: { tertulis: [], interpretasi: [] },
      hasil_musyawarah: { tertulis: [], interpretasi: [] },
      jadwal_kegiatan: { tertulis: [], interpretasi: [] },
      daftar_nama_dan_petugas: { tertulis: [], interpretasi: [] },
      pembagian_kelompok: { tertulis: [], interpretasi: [] },
      tugas_masing_orang: { tertulis: [], interpretasi: [] },
      informasi_keuangan: { tertulis: [], interpretasi: [] },
      rencana_kegiatan: { tertulis: [], interpretasi: [] },
      catatan_tambahan: { tertulis: [], interpretasi: [] },
      perlu_konfirmasi: { tertulis: [], interpretasi: [] },
      teks_per_halaman: [{ halaman: 1, mentah: '' }],
      tidak_terbaca: [],
    }),
  ].join('\n')
}

function userPrompt(pageCount) {
  return `Analisis ${pageCount} halaman catatan rapat ini. Ikuti semua aturan dalam instruksi sistem. Kembalikan JSON sesuai struktur, dengan ${pageCount} entri pada teks_per_halaman.`
}

function normalizeResult(parsed) {
  const out = parsed && typeof parsed === 'object' ? parsed : {}
  for (const [key] of CATEGORIES) {
    const value = out[key]
    if (!value || typeof value !== 'object') out[key] = { tertulis: [], interpretasi: [] }
    else {
      out[key].tertulis = Array.isArray(value.tertulis) ? value.tertulis.map(String) : []
      out[key].interpretasi = Array.isArray(value.interpretasi) ? value.interpretasi.map(String) : []
    }
  }
  out.teks_per_halaman = Array.isArray(out.teks_per_halaman)
    ? out.teks_per_halaman.map((p, i) => ({
      halaman: Number(p?.halaman) || i + 1,
      mentah: String(p?.mentah || ''),
    }))
    : []
  out.tidak_terbaca = Array.isArray(out.tidak_terbaca) ? out.tidak_terbaca.map(String) : []
  return out
}

function parseJson(text) {
  let raw = String(text || '').trim()
  raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start < 0 || end <= start) throw new Error('Model tidak mengembalikan objek JSON.')
  try {
    return normalizeResult(JSON.parse(raw.slice(start, end + 1)))
  } catch (err) {
    throw new Error('JSON dari model tidak valid: ' + err.message)
  }
}

function apiKey() {
  return String(process.env.GEMINI_API_KEY || global.geminikey || global.apiKeys?.gemini || '').trim()
}

function toDataUrl(image) {
  const mime = String(image.mime || 'image/jpeg').split(';')[0]
  return `data:${mime};base64,${image.buffer.toString('base64')}`
}

async function callLocal(images, pageCount) {
  const url = String(process.env.NOTE_VISION_URL || '').trim()
  if (!url) return null
  const endpoint = /\/chat\/completions\/?$/.test(url) ? url : `${url.replace(/\/$/, '')}/chat/completions`
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), Number(process.env.NOTE_VISION_TIMEOUT_MS) || 180000)
  try {
    const headers = { 'Content-Type': 'application/json' }
    if (process.env.NOTE_VISION_KEY) headers.Authorization = `Bearer ${process.env.NOTE_VISION_KEY}`
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.NOTE_VISION_MODEL || 'llava:latest',
        temperature: 0,
        messages: [
          { role: 'system', content: systemInstruction() },
          {
            role: 'user',
            content: [
              { type: 'text', text: userPrompt(pageCount) },
              ...images.map((image, i) => ({
                type: 'image_url',
                image_url: { url: toDataUrl(image), detail: 'high' },
                label: `HALAMAN ${i + 1}`,
              })),
            ],
          },
        ],
      }),
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${(await response.text()).slice(0, 200)}`)
    const json = await response.json()
    const text = json?.choices?.[0]?.message?.content
    if (!text) throw new Error('Respons lokal tidak berisi teks.')
    return { result: parseJson(text), provider: `lokal:${process.env.NOTE_VISION_MODEL || 'llava:latest'}` }
  } finally {
    clearTimeout(timer)
  }
}

async function callGemini(images, pageCount) {
  const key = apiKey()
  if (!key) return null
  const models = [process.env.NOTE_VISION_GEMINI_MODEL, 'gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.0-flash']
    .filter(Boolean)
  const parts = []
  images.forEach((image, i) => {
    parts.push({ text: `HALAMAN ${i + 1}` })
    parts.push({ inlineData: { mimeType: String(image.mime || 'image/jpeg').split(';')[0], data: image.buffer.toString('base64') } })
  })
  parts.push({ text: userPrompt(pageCount) })
  let lastError
  for (const model of models) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), Number(process.env.NOTE_VISION_TIMEOUT_MS) || 180000)
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction() }] },
          contents: [{ role: 'user', parts }],
          generationConfig: { temperature: 0, maxOutputTokens: 8192, responseMimeType: 'application/json' },
        }),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${(await response.text()).slice(0, 200)}`)
      const json = await response.json()
      const text = json?.candidates?.[0]?.content?.parts?.filter((p) => p.text).map((p) => p.text).join('\n')
      if (!text) throw new Error('Respons Gemini tidak berisi teks.')
      return { result: parseJson(text), provider: `gemini:${model}` }
    } catch (err) {
      lastError = err
      if (/401|403|API key not valid/i.test(err.message)) break
    } finally {
      clearTimeout(timer)
    }
  }
  throw new Error('Gemini gagal: ' + (lastError?.message || 'unknown'))
}

async function analyzePages(images) {
  const pages = images.filter((x) => Buffer.isBuffer(x.buffer) && x.buffer.length)
  if (!pages.length) throw new Error('Tidak ada gambar untuk dianalisis.')
  if (pages.length > 10) throw new Error('Maksimal 10 halaman per sesi analisis.')
  const errors = []
  if (process.env.NOTE_VISION_URL) {
    try { return await callLocal(pages, pages.length) } catch (err) { errors.push(`lokal: ${err.message}`) }
  }
  if (apiKey()) {
    try { return await callGemini(pages, pages.length) } catch (err) { errors.push(err.message) }
  }
  throw new Error([
    'Tidak ada provider vision yang aktif.',
    errors.join(' | '),
    'Pilih salah satu: pasang Ollama vision lalu set NOTE_VISION_URL=http://127.0.0.1:11434/v1 dan NOTE_VISION_MODEL=qwen2.5vl (gratis),',
    'atau isi GEMINI_API_KEY di environment / global.geminikey di settings.js dengan kunci aktif dari https://aistudio.google.com/apikey.',
  ].join('\n'))
}

module.exports = { CATEGORIES, UNREADABLE, systemInstruction, userPrompt, normalizeResult, parseJson, analyzePages }

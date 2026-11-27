// Unggah buffer ke host sementara -> URL. Dipakai fitur tambahan (uploadImage / uploader / uploadPomf).
'use strict'
const axios = require('axios')
const FormData = require('form-data')

async function fileInfo(buffer) {
  try {
    const ft = await import('file-type')
    const r = await ft.fileTypeFromBuffer(buffer)
    if (r) return { ext: r.ext, mime: r.mime }
  } catch {}
  return { ext: 'bin', mime: 'application/octet-stream' }
}

async function uploader(buffer) {
  if (!Buffer.isBuffer(buffer)) throw new TypeError('Buffer diperlukan')
  const { ext, mime } = await fileInfo(buffer)
  const mk = (field, extra = {}) => {
    const f = new FormData()
    for (const [k, v] of Object.entries(extra)) f.append(k, v)
    f.append(field, buffer, { filename: `file.${ext}`, contentType: mime })
    return f
  }
  const hosts = [
    async () => {
      const f = mk('fileToUpload', { reqtype: 'fileupload' })
      const { data } = await axios.post('https://catbox.moe/user/api.php', f, { headers: f.getHeaders(), timeout: 40000, maxBodyLength: Infinity })
      if (!/^https?:\/\//.test(String(data))) throw new Error('catbox gagal')
      return String(data).trim()
    },
    async () => {
      const f = mk('files[]')
      const { data } = await axios.post('https://uguu.se/upload', f, { headers: f.getHeaders(), timeout: 40000, maxBodyLength: Infinity })
      const u = data?.files?.[0]?.url
      if (!u) throw new Error('uguu gagal')
      return u
    },
    async () => {
      const f = mk('file')
      const { data } = await axios.post('https://tmpfiles.org/api/v1/upload', f, { headers: f.getHeaders(), timeout: 40000, maxBodyLength: Infinity })
      const u = data?.data?.url
      if (!u) throw new Error('tmpfiles gagal')
      return u.replace('tmpfiles.org/', 'tmpfiles.org/dl/')
    }
  ]
  let last
  for (const h of hosts) {
    try { return await h() } catch (e) { last = e }
  }
  throw new Error('Semua host upload gagal: ' + (last && last.message))
}

module.exports = { __esModule: true, default: uploader, uploader, uploadImage: uploader, uploadPomf: uploader }

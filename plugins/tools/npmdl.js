// tools/npmdl — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/npmdl.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "npmdl",
  "command": [
    "npmdl",
    "npmdownload"
  ],
  "category": "tools",
  "desc": "Download package NPM dalam format tarball .tgz",
  "usage": ".npmdl <package atau URL NPM>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/npmdl", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/npmdl.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  /*
    Fitur tambahan hasil audit FURINA V17 → WhatsApp Bot.
  */
  
  const axios = __vxDef(require("axios"));
  const { createWriteStream, existsSync, mkdirSync, readFileSync, unlinkSync } = require("node:fs");
  const { resolve } = require("node:path");
  
  const pluginConfig = {
      name: 'npmdl',
      alias: ['npmdownload'],
      category: 'tools',
      description: 'Download package NPM dalam format tarball .tgz',
      usage: '.npmdl <package atau URL NPM>',
      example: '.npmdl axios',
      cooldown: 15,
      energi: 1,
      isEnabled: true
  }
  
  const REGISTRY = 'https://registry.npmjs.org'
  
  async function handler(m) {
      let packageName = m.text?.trim()
      if (!packageName) return m.reply(`Contoh: ${m.prefix}npmdl axios`)
  
      const match = packageName.match(/npmjs\.com\/package\/([^/?#]+)/i)
      if (match) packageName = match[1]
      packageName = packageName.replace(/^@/, '@').trim().toLowerCase()
  
      try {
          m.react('⌛')
          const { data } = await axios.get(`${REGISTRY}/${packageName.split('/').map(encodeURIComponent).join('/')}`, {
              headers: { 'User-Agent': 'WhatsApp Bot NPM Downloader' },
              timeout: 20000
          })
  
          const version = data?.['dist-tags']?.latest
          const pkg = version ? data.versions?.[version] : null
          const tarball = pkg?.dist?.tarball
          if (!version || !tarball) throw new Error('Package atau tarball tidak ditemukan')
  
          const safeName = packageName.replace(/[^a-zA-Z0-9._-]/g, '_')
          const fileName = `${safeName}-${version}.tgz`
          const tempDir = resolve('./temp')
          const filePath = resolve(tempDir, fileName)
          mkdirSync(tempDir, { recursive: true })
  
          const response = await axios.get(tarball, {
              responseType: 'stream',
              timeout: 60000,
              maxContentLength: 100 * 1024 * 1024,
              headers: { 'User-Agent': 'WhatsApp Bot NPM Downloader' }
          })
  
          const writer = createWriteStream(filePath)
          response.data.pipe(writer)
          await new Promise((resolvePromise, rejectPromise) => {
              writer.on('finish', resolvePromise)
              writer.on('error', rejectPromise)
              response.data.on('error', rejectPromise)
          })
  
          const caption = [
              '📦 *NPM PACKAGE DOWNLOADER*',
              '',
              `🏷️ Nama: *${packageName}*`,
              `📌 Versi: *v${version}*`,
              `👤 Author: *${pkg.author?.name || pkg.maintainers?.[0]?.name || '-'}*`,
              `📜 Lisensi: *${typeof pkg.license === 'string' ? pkg.license : pkg.license?.type || '-'}*`,
              `📝 Deskripsi: ${pkg.description || '-'}`
          ].join('\n')
  
          await m.reply({
              document: readFileSync(filePath),
              mimetype: 'application/gzip',
              fileName,
              caption
          })
          m.react('✅')
          if (existsSync(filePath)) unlinkSync(filePath)
      } catch (error) {
          console.error('[npmdl]', error)
          m.react('❌')
          return m.reply('❌ Gagal mendownload package NPM. Cek nama package atau coba lagi nanti.')
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})

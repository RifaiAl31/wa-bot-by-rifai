// Fitur owner/sp2 — manajemen plugin + kirim kode plugin secara privat di grup (BPR)
//   .sp2 + <[kategori/]nama>   (reply kode / file .js)  -> pasang plugin
//   .sp2 - <perintah>                                    -> hapus plugin (dicadangkan)
//   .sp2 ? <perintah>                                    -> ambil kode plugin
//   .sp2 @user <perintah>                                -> kirim kode ke user itu saja, di dalam grup
const fs = require('fs')
const path = require('path')
const pm = require('../../lib/pluginmgr')
const { getMedia, getQuotedText, getContextInfo } = require('../../lib/utils')
const { sendBatchPrivateRelayUnified } = require('../../lib/privrelay')

const ROOT = path.join(__dirname, '..', '..')

// file stub engine -> kode aslinya ada di engine/<pack>/plugins/<rel>.js
function sourceOf(file) {
  const raw = fs.readFileSync(file, 'utf8')
  const m = raw.match(/lib\/engine\/(engine\d+)'\)\.(?:plugin|hook)\(\s*["']([^"']+)["']/)
  if (m) {
    const real = path.join(ROOT, 'engine', m[1], 'plugins', m[2] + '.js')
    if (fs.existsSync(real)) return { code: fs.readFileSync(real, 'utf8'), file: real }
  }
  return { code: raw, file }
}

const find = (plugins, q) => plugins.find((p) => pm.commandsOf(p).includes(q) || String(p.name).toLowerCase() === q || (p.__file && path.basename(p.__file, '.js').toLowerCase() === q))

module.exports = {
  name: 'sp2',
  command: ['sp2', 'sp'],
  category: 'owner',
  emoji: '🛠️',
  desc: 'Manajemen plugin (tambah, hapus, ambil) + kirim kode plugin privat di grup via BPR',
  usage: 'sp2 + nama | sp2 - perintah | sp2 ? perintah | sp2 @user perintah',
  owner: true,
  run: async ({ sock, msg, from, args, body, prefix, command, isGroup, plugins, reloadPlugins, reply }) => {
    const ci = getContextInfo(msg) || {}
    const mentioned = ci.mentionedJid || []
    const target = mentioned[0] || (ci.quotedMessage && ci.participant) || null
    const op = args[0] && ['+', '-', '?'].includes(args[0][0]) ? args[0][0] : null

    if (!op && !target) {
      return reply(`🛠️ *PLUGIN MANAGER*\n\nFormat: \`${prefix}${command} [opsi] [nama/perintah]\`\n\n*Opsi:*\n  \`+\` tambah/simpan plugin (reply kode / file .js)\n  \`-\` hapus plugin\n  \`?\` ambil kode plugin\n\n*Kirim privat (BPR, di grup):*\n  \`${prefix}${command} @user perintah\``)
    }

    const words = (op ? args.slice(1) : args).filter((a) => !a.startsWith('@') && a !== '-f')
    const query = (words[0] || '').toLowerCase().replace(/^[./!#]/, '')
    if (!query) return reply('❌ Masukkan nama atau perintah plugin.')

    if (op === '+') {
      const spec = words[0]
      const [cat, nm] = spec.includes('/') ? spec.split('/') : [null, spec]
      const name = nm.replace(/\.(js|cjs)$/i, '')
      let raw = ''
      const doc = await getMedia(sock, msg, ['documentMessage']).catch(() => null)
      if (doc) raw = doc.buffer.toString('utf8')
      if (!raw) raw = getQuotedText(msg)
      if (!raw) { const nl = String(body || '').indexOf('\n'); if (nl !== -1) raw = body.slice(nl + 1) }
      if (!raw.trim()) return reply('❌ Balas pesan berisi kode atau kirim file .js untuk disimpan.')
      const r = pm.install({ code: pm.cleanCode(raw), category: cat, name, force: args.includes('-f'), current: plugins, reload: reloadPlugins })
      if (r.error) return reply(`❌ ${r.error}`)
      return reply(`✅ *Plugin ${r.overwritten ? 'diganti' : 'terpasang'}!*\n\n📍 plugins/${r.cat}/${r.name}.js\n⚙️ Perintah: ${r.cmds.map((c) => prefix + c).join(', ')}\n\n> Langsung aktif, tanpa restart.`)
    }

    const plugin = find(plugins, query)
    if (!plugin || !plugin.__file) {
      const similar = plugins.filter((p) => p.__file && (String(p.name).includes(query) || pm.commandsOf(p).some((c) => c.includes(query)))).slice(0, 5).map((p) => `> • ${path.relative(pm.PDIR, p.__file)}`)
      return reply(`❌ Plugin \`${query}\` tidak ditemukan.${similar.length ? `\n\n*Mungkin maksud kamu:*\n${similar.join('\n')}` : ''}`)
    }

    if (op === '-') {
      const r = pm.remove({ plugin, reload: reloadPlugins })
      if (r.error) return reply(`❌ ${r.error}`)
      return reply(`🗑️ *Plugin \`${r.file}\` dihapus.*\nCadangan: database/plugin-backup/${r.backup}`)
    }

    const src = sourceOf(plugin.__file)
    const rel = path.relative(pm.PDIR, plugin.__file)

    if (op === '?') {
      return sock.sendMessage(from, { document: Buffer.from(src.code), mimetype: 'text/javascript', fileName: path.basename(src.file) }, { quoted: msg })
    }

    // kirim privat via BPR
    if (!isGroup) return reply('❌ *Kirim privat via BPR hanya bisa di grup.*')
    await sock.sendMessage(from, { react: { text: '⏳', key: msg.key } }).catch(() => {})
    try {
      const payload = {
        interactiveMessage: {
          header: { title: '', hasMediaAttachment: false },
          body: { text: '' },
          footer: { text: `Kode plugin \`${rel}\`:` },
          nativeFlowMessage: { buttons: [{ name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: 'salin code', id: 'copy_plugin_code', copy_code: src.code }) }] },
          contextInfo: { mentionedJid: [target] }
        }
      }
      await sendBatchPrivateRelayUnified(sock, from, [target], payload, {
        msgForOthers: '🔒 _[Seseorang mengirim source code plugin secara rahasia]_',
        additionalNodes: [{ tag: 'biz', attrs: {}, content: [{ tag: 'interactive', attrs: { type: 'native_flow', v: '1' }, content: [{ tag: 'native_flow', attrs: { v: '9', name: 'mixed' } }] }] }]
      })
      await sock.sendMessage(from, { react: { text: '✅', key: msg.key } }).catch(() => {})
    } catch (e) {
      console.log('[SP2] BPR:', e.message)
      await sock.sendMessage(from, { react: { text: '❌', key: msg.key } }).catch(() => {})
      return reply(`⚠️ Gagal mengirim kode via BPR: ${e.message}`)
    }
  }
}

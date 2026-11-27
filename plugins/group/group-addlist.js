// group/group-addlist — satu file: metadata + kode fitur (gabungan dari engine2/plugins/group/group-addlist.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "addlist",
    "dellist",
    "list"
  ],
  "category": "group",
  "owner": false,
  "group": true,
  "admin": true,
  "botAdmin": false,
  "desc": "Fitur addlist (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/group-addlist", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/group-addlist.js'
  const __vxExports = {};
  // pake ini aja
  let handler = async (m, { text, command, usedPrefix }) => {
    if (!m.isGroup) throw 'Fitur ini hanya untuk grup!'
  
    let chat = global.db.data.chats[m.chat] || (global.db.data.chats[m.chat] = {})
    chat.listmsg = chat.listmsg || {}
  
    if (command === 'addlist') {
      if (!m.quoted) throw 'Reply pesan yang ingin disimpan'
      if (!text) throw `Contoh:\n${usedPrefix}addlist tes`
  
      let key = text.trim().toLowerCase()
  
      chat.listmsg[key] = m.quoted.fakeObj || m.quoted
  
      return m.reply(`✅ Berhasil menambahkan list *${key}*`)
    }
  
    if (command === 'list') {
      let keys = Object.keys(chat.listmsg)
  
      if (!keys.length) throw 'List masih kosong'
  
      let teks = '📋 *LIST MESSAGE*\n\n'
      teks += keys.map((v, i) => `${i + 1}. ${v}`).join('\n')
  
      return m.reply(teks)
    }
  
    if (command === 'dellist') {
      if (!text) throw `Contoh:\n${usedPrefix}dellist tes`
  
      let key = text.trim().toLowerCase()
  
      if (!chat.listmsg[key]) throw 'List tidak ditemukan'
  
      delete chat.listmsg[key]
  
      return m.reply(`🗑️ Berhasil menghapus list *${key}*`)
    }
  }
  
  handler.before = async function (m) {
    if (!m.isGroup) return
    if (!m.text) return
  
    let chat = global.db.data.chats[m.chat]
    if (!chat?.listmsg) return
  
    let key = m.text.trim().toLowerCase()
  
    if (
      key.startsWith('.') ||
      key.startsWith('#') ||
      key.startsWith('!') ||
      key.startsWith('/')
    ) return
  
    let data = chat.listmsg[key]
    if (!data) return
  
    try {
      await this.copyNForward(m.chat, data, true)
      return true
    } catch (e) {
      console.error(e)
    }
  }
  
  handler.help = ['addlist', 'list', 'dellist']
  handler.tags = ['group']
  handler.command = /^(addlist|list|dellist)$/i
  handler.group = true
  handler.admin = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})

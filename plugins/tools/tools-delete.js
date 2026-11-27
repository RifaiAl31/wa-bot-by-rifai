// tools/tools-delete — satu file: metadata + kode fitur (gabungan dari engine2/plugins/tools/tools-delete.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "d",
    "erase",
    "hps"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur hps (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/tools-delete", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tools-delete.js'
  const __vxExports = {};
  const handler = async (m, { conn, command }) => {
    if (!m.quoted) throw 'Reply pesan yang ingin dihapus';
    try {
      let bilek = m.message.extendedTextMessage.contextInfo.participant;
      let banh = m.message.extendedTextMessage.contextInfo.stanzaId;
      return conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: banh, participant: bilek } });
    } catch {
      return conn.sendMessage(m.chat, { delete: m.quoted.vM.key });
    }
  };
  
  handler.help = ['del', 'delete','d'];
  handler.tags = ['tools'];
  handler.command = /^(delete|del|hps|hapus|erase|d)$/i;
  handler.admin = false;
  
  const __vxDefault = handler;
  
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})

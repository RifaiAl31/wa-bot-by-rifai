// group/link — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "grouplink"
  ],
  "category": "group",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur grouplink",
  "usage": ".grouplink"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/group/link", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/link.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  let handler = async (m, { conn, groupMetadata }) => {
      try {
          const invite = await conn.groupInviteCode(m.chat);
          const link = `https://chat.whatsapp.com/${invite}`;
          const groupName = groupMetadata?.subject || 'Unknown Group';
          const info = `🔗 *LINK GRUP WHATSAPP*\n\n` +
                       `📛 *Nama Grup:* ${groupName}\n` +
                       `🔑 *Group ID:* \`\`\`${m.chat}\`\`\`\n` +
                       `🌐 *Link Undangan:*\n${link}`;
  
          try {
              await conn.sendButton(m.chat, {
                  text: info,
                  title: "Group Link",
                  footer: "Gunakan tombol di bawah untuk menyalin tautan grup",
                  buttons: [
                      {
                          name: "cta_copy",
                          buttonParamsJson: JSON.stringify({
                              display_text: "📋 Salin Link Grup",
                              copy_code: link,
                          }),
                      },
                  ],
                  hasMediaAttachment: false,
              }, { quoted: m });
          } catch {
              await m.reply(info);
          }
      } catch (e) {
          conn.logger?.error(e);
          m.reply(typeof e === 'string' ? e : (e.message || String(e)));
      }
  };
  
  handler.help = ["grouplink", "linkgc"];
  handler.tags = ["group"];
  handler.command = /^(grouplink|link|linkgc)$/i;
  handler.group = true;
  handler.botAdmin = true;
  
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})

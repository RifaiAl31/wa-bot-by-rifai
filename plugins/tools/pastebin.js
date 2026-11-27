// tools/pastebin — satu file: metadata + kode fitur (gabungan dari engine3/plugins/tools/pastebin.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "pastebin",
  "command": [
    "paste",
    "pb"
  ],
  "category": "tools",
  "desc": "Upload teks ke Pastebin",
  "usage": ".pastebin <text>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/pastebin", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/pastebin.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const { sendToolsPreview } = require("../../lib/ext/src/lib/vanxone-context.js");
  const pluginConfig = {
    name: "pastebin",
    alias: ["paste", "pb"],
    category: "tools",
    description: "Upload teks ke Pastebin",
    usage: ".pastebin <text>",
    example: '.pastebin console.log("Hello World")',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    let text = m.args.join(" ");
  
    if (m.quoted?.text) {
      text = m.quoted.text;
    }
  
    if (!text) {
      return m.reply(
        `📋 *ᴘᴀsᴛᴇʙɪɴ ᴜᴘʟᴏᴀᴅ*\n\n` +
          `Kirim teks untuk di-upload ke Pastebin.\n\n` +
          `*Cara pakai:*\n` +
          `• \`${m.prefix}pastebin <text>\`\n` +
          `• Reply teks dengan \`${m.prefix}pastebin\`\n\n` +
          `> Contoh: \`${m.prefix}pastebin console.log("Hello")\``,
      );
    }
  
    const api_dev_key = "h9WMT2Mn9QW-qDhvUSc-KObqAYcjI0he";
    const api_paste_code = text.trim();
    const api_paste_name = `Paste dari ${m.pushName || "User"} - ${new Date().toLocaleDateString("id-ID")}`;
  
    const data = new URLSearchParams({
      api_dev_key,
      api_option: "paste",
      api_paste_code,
      api_paste_name,
      api_paste_private: "1",
    });
  
    try {
      const res = await axios.post(
        "https://pastebin.com/api/api_post.php",
        data.toString(),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          timeout: 15000,
        },
      );
  
      const url = res.data;
  
      if (url.startsWith("Bad API request")) {
        return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> ${url}`);
      }
  
      const responseText =
        `✅ *ᴘᴀsᴛᴇʙɪɴ ʙᴇʀʜᴀsɪʟ*\n\n` +
        `╭┈┈⬡「 📋 *ᴅᴇᴛᴀɪʟ* 」\n` +
        `┃ 📝 ᴊᴜᴅᴜʟ: *${api_paste_name}*\n` +
        `┃ 📊 ᴜᴋᴜʀᴀɴ: *${text.length} chars*\n` +
        `┃ 🔗 ʟɪɴᴋ: ${url}\n` +
        `╰┈┈⬡\n\n` +
        `> Paste akan expired sesuai pengaturan Pastebin.`;
      await sendToolsPreview(
        sock,
        m.chat,
        responseText,
        "Pastebin Upload",
        api_paste_name,
        { quoted: m },
      );
    } catch (e) { globalThis.__vanxoneCatch?.(e);
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})

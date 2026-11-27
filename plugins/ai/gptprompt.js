// ai/gptprompt — satu file: metadata + kode fitur (gabungan dari engine1/plugins/ai/gptprompt.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "gpts",
  "command": [
    "gpts",
    "aichat"
  ],
  "category": "ai",
  "desc": "Chat dengan AI menggunakan persona custom (Style Ai WhatsApp Bot ✨)",
  "usage": ".gptprompt prompt | teks",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/gptprompt", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/gptprompt.js'
  const module = { exports: {} }; const exports = module.exports;
  const axios = require('axios');
  
  const pluginConfig = {
      name: ['gptprompt'],
      alias: ['gpts', 'aichat'],
      category: 'ai',
      description: 'Chat dengan AI menggunakan persona custom (Style Ai WhatsApp Bot ✨)',
      usage: '.gptprompt prompt | teks',
      example: '.gptprompt Seolah kamu Ai WhatsApp Bot | Halo~',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  };
  
  async function handler(m, context) {
      const { sock } = context;
      const prefix = m.prefix || '.';
      const command = m.command || 'gptprompt';
  
      let text = m.text || "";
  
      // 🌸 Validasi awal
      if (!text) {
          return m.reply(
  `🌸 *Ai WhatsApp Bot says~* ✨
  
  "Hmm? Kamu manggil aku tapi nggak kasih pesan? Nakal ya~"
  
  📌 *Contoh penggunaan:*
  \`${prefix + command} Seolah kamu Ai WhatsApp Bot | Halo~\``
          );
      }
  
      // 🌸 Split prompt & isi
      let [prompt, isi] = text.split('|').map(v => v.trim());
  
      if (!prompt || !isi) {
          return m.reply(
  `🌸 *Eh eh~ tunggu dulu!* 💫
  
  Formatnya masih kurang lengkap loh!
  
  📌 *Gunakan seperti ini:*
  \`${prefix + command} prompt | pesan\`
  
  ✨ *Contoh:*
  \`${prefix + command} Jadi idol imut | Halo kamu lagi apa?\``
          );
      }
  
      try {
          m.react('🌸');
  
          // 🌐 API baru
          let api = `https://api-faa.my.id/faa/gpt-promt?prompt=${encodeURIComponent(prompt)}&text=${encodeURIComponent(isi)}`;
          const { data } = await axios.get(api);
  
          if (!data.status) {
              throw new Error('AI lagi capek... coba lagi nanti ya 😢');
          }
  
          const result = data.result.trim();
  
          // 🌸 Template pesan Ai WhatsApp Bot
          const finalText =
  `╭━━━『 🌸 *Ai WhatsApp Bot Chat* 🌸 』━━━
  │
  │ 💬 *Kamu bilang:*
  │ ${isi}
  │
  │ ✨ *Ai menjawab:*
  │ ${result}
  │
  ╰━━━━━━━━━━━━━━━━━━━
  
  💖 *"Aku akan selalu bersinar hanya untukmu~"* ✨`;
  
          await sock.sendMessage(m.chat, {
              text: finalText,
              contextInfo: {
              }
          }, { quoted: m });
  
          m.react('✨');
  
      } catch (e) {
          console.error(e);
          m.react('❌');
  
          return m.reply(
  `🌸 *Gomen ne...* 😭💔
  
  Sepertinya Ai lagi kehilangan sinarnya...
  
  📌 *Error:*
  \`${e.message}\`
  
  💡 Coba lagi ya nanti~ aku pasti kembali bersinar ✨`
          );
      }
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  };
  return module.exports
})

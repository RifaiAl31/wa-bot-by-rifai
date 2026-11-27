// tools/styletext — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "styletext",
    "textstyle"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur styletext",
  "usage": ".styletext <teks>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/tools/styletext", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/styletext.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { text, usedPrefix, command }) => {
      if (!text) {
          return m.reply(`✨ *STYLE TEXT / FANCY FONT GENERATOR*\n\nUbah teks biasa menjadi berbagai gaya font keren!\nContoh:\n${usedPrefix + command} WhatsApp Bot Bot`);
      }
  
      try {
          let res = await fetch(`https://api.lolhuman.xyz/api/styletext?apikey=GataDios&text=${encodeURIComponent(text)}`).catch(() => null);
          let styles = [];
  
          if (res && res.ok) {
              let json = await res.json();
              if (json.status && json.result) styles = json.result;
          }
  
          if (!styles || styles.length === 0) {
              // Local fallback styles
              const fonts = [
                  t => t.toUpperCase(),
                  t => t.split('').join(' '),
                  t => '『 ' + t + ' 』',
                  t => '【 ' + t + ' 】',
                  t => '★ ' + t + ' ★',
                  t => '╰┈➤ ' + t,
                  t => '•·.·´¯`·.·• ' + t + ' •·.·´¯`·.·•'
              ];
              styles = fonts.map(fn => fn(text));
          }
  
          let caption = `✨ *GAYA FONT (STYLE TEXT)*\n\n`;
          styles.slice(0, 20).forEach((st, i) => {
              let val = typeof st === 'object' ? (st.result || st.name || JSON.stringify(st)) : st;
              caption += `*[${i + 1}]* ${val}\n`;
          });
          caption += `\n💡 *Salin teks gaya yang kamu suka!*`;
  
          await m.reply(caption);
      } catch (e) {
          m.reply(`❌ Error: ${e.message}`);
      }
  };
  
  handler.help = ['styletext <teks>', 'fancytext <teks>'];
  handler.tags = ['tools'];
  handler.command = /^(styletext|fancytext|font|textstyle)$/i;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})

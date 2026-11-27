// search/moviebox — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "moviebox",
    "searchmovie"
  ],
  "category": "search",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur moviebox",
  "usage": ".moviebox <query>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/movie/moviebox", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/moviebox.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  let handler = async (m, { conn, usedPrefix, command, text }) => {
      try {
          const query = text, page = 1, perPage = 10, subjectType = ''
          if (!text) return m.reply(`⚠️ Masukkan judul film/series!\nContoh: ${usedPrefix + command} spiderman`);
  
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
          const response = await fetch(`${global.web}/api/movie/moviebox_search?apikey=${global.apikey?.vxapi}&query=${encodeURIComponent(query || '')}&page=${encodeURIComponent(page || '')}&perPage=${encodeURIComponent(perPage || '')}&subjectType=${encodeURIComponent(subjectType || '')}`);
          const json = await response.json();
          
          if (!json.status || !json.result) throw new Error("Film tidak ditemukan");
  
          let listData = json.result.data?.list || json.result.list || json.result.data || json.result;
          if (!Array.isArray(listData) || listData.length === 0) throw new Error("Film tidak ditemukan atau query salah.");
  
          let res = `🍿 *MOVIEBOX SEARCH*\n\n`;
          for (let i = 0; i < Math.min(listData.length, 5); i++) {
              let movie = listData[i];
              res += `🔸 *Title:* ${movie.title}\n`;
              if (movie.year) res += `📅 *Year:* ${movie.year}\n`;
              if (movie.score) res += `⭐ *Score:* ${movie.score}\n`;
              res += `\n`;
          }
  
          await conn.sendMessage(m.chat, {
              image: { url: listData[0].cover || listData[0].poster || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Netflix_logo.svg/1200px-Netflix_logo.svg.png' },
              caption: res
          }, { quoted: m });
  
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
      } catch (e) {
          console.error(e);
          m.reply("❌ Error: " + e.message);
      }
  };
  handler.help = ["moviebox <query>"];
  handler.command = ["moviebox", "searchmovie"];
  handler.tags = ["movie"];
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})

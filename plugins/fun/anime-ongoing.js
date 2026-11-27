// anime/anime-ongoing — satu file: metadata + kode fitur (gabungan dari engine2/plugins/anime/anime-ongoing.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "ongoing"
  ],
  "category": "fun",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur ongoing (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/anime").split('\\').join('/')
module.exports = __vx.plugin("anime/anime-ongoing", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/anime-ongoing.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  /*
  Fixxed by WhatsApp Bot
  Watermark © WhatsApp Bot
  */
  
  const axios = __vxDef(require("axios"));
  const cheerio = __vxNs(require("cheerio"));
  const moment = __vxDef(require("moment")); 
  
  moment.locale('id'); 
  
  const livecharttba = async () => {
    let { data } = await axios.get("https://www.livechart.me/summer-2024/tv");
    const $ = cheerio.load(data);
    const Result = [];
    $("#content > main > article:nth-child(n)").each((i, e) => {
      const judul = $(e).find("div > h3 > a").text();
      const image = $(e).find("div > div.poster-container > img").attr("src");
      const eps = $(e).find("div > div.poster-container > a > div").text();
      const timestamp = $(e).find("time[data-anime-card-target='countdown']").attr("data-timestamp");
      const jadwal = moment.unix(timestamp).format("YYYY-MM-DD HH:mm:ss");
  
      const now = moment();
      const releaseDate = moment.unix(timestamp);
      const duration = moment.duration(releaseDate.diff(now));
      const countdown = `${duration.days()}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
  
      const studio = $(e).find("div > div.anime-info > ul > li > a").text();
      const adaptasi = "Diadaptasi dari " + $(e).find("div > div.anime-info > div.anime-metadata > div.anime-source").text();
      const tags = [];
      $(e).find("div > ol > li:nth-child(n)").each((i, b) => {
        const a = $(b).find("a").text();
        tags.push(a);
      });
      const linkInfo = $(e).find("div > ul > li:nth-child(2) > a").attr("href");
      const hari = moment.unix(timestamp).format('dddd'); 
      console.log(`Anime: ${judul}, Hari: ${hari}`); 
      Result.push({
        judul,
        tags,
        jadwal,
        countdown, 
        image,
        studio,
        adaptasi,
        eps,
        hari 
      });
    });
    return Result;
  };
  
  let handler = async (m, { conn, command, args }) => {
    let hariFilter = args[0] ? args[0].toLowerCase() : null;
    let anime = await livecharttba();
    if (hariFilter) {
      console.log(`Filtering by day: ${hariFilter}`); 
      anime = anime.filter(a => a.hari.toLowerCase() === hariFilter);
    }
    let hasil = anime
      .map(
        (a, i) =>
          `*${i + 1}. ${a.judul.toUpperCase()}*\n_*• Genre:* ${a.tags.join(" ")}_\n_*• Studio:* ${a.studio}_\n_*• Adaption:* ${a.adaptasi}_\n_*• Next Eps:* ${a.eps}_\n_*• Date:* ${a.jadwal}_\n_*• Countdown:* ${a.countdown}_`
      )
      .join("\n\n");
    m.reply(hasil);
  };
  
  handler.help = ['ongoing [hari]'];
  handler.command = ['ongoing'];
  handler.tags = ['anime'];
  handler.register = true
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})

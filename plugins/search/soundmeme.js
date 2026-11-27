// search/soundmeme — satu file: metadata + kode fitur (gabungan dari engine7/plugins/search/soundmeme.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "soundmeme2",
  "command": [
    "soundmeme2"
  ],
  "category": "search",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/search").split('\\').join('/')
module.exports = __vx.plugin("search/soundmeme", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/soundmeme.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  /**
   • Fitur By WhatsApp Bot
   • Created : WhatsApp Bot 
   • SEARCH AUTO KIRIM SOUND MEME | SEARCH LIST NAMA SOUND MEME | RANDOM SOUND MEME
   • 
  **/
  
  const axios = __vxDef(require("axios"));
  const cheerio = __vxNs(require("cheerio"));
  
  const pluginConfig = {
    name: "soundmeme2",
    alias: [],
    category: "search",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, {
      sock,
      text,
      command
  }) {
      const conn = sock;
      const baseUrl = 'https://www.myinstants.com/en/search/?name=';
  
      if (command === 'soundmeme-listnama') {
          if (!text) {
              return m.reply('Silakan masukkan nama suara untuk DICARI.');
          }
  
          const url = `${baseUrl}${encodeURIComponent(text)}`;
  
          try {
              const {
                  data
              } = await axios.get(url, {
                  headers: {
                      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36'
                  }
              });
  
              const $ = cheerio.load(data);
  
              const instants = $('div.instant');
  
              if (instants.length === 0) {
                  return m.reply('Suara tidak ditemukan dengan nama tersebut.');
              }
  
              let list = '';
              instants.each((index, element) => {
                  const soundName = $(element).find('.instant-link').text().trim();
                  list += `${index + 1}. ${soundName}\n`;
              });
  
              m.reply(`noh ada:\n\n• ${list || 'Tidak ada sound meme.'}`);
  
          } catch (err) {
              console.error(err);
              m.reply('Terjadi kesalahan saat mengambil suara.');
          }
      } else if (command === 'soundmeme-random') {
          const url = 'https://www.myinstants.com/en/index/id/';
  
          try {
              const {
                  data
              } = await axios.get(url, {
                  headers: {
                      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36'
                  }
              });
  
              const $ = cheerio.load(data);
  
              const randomInstant = $('div.instant').eq(Math.floor(Math.random() * $('div.instant').length));
  
              const audioUrl = `https://www.myinstants.com${randomInstant.find('button').attr('onclick').match(/'([^']+)'/)[1]}`;
  
              const response = await axios({
                  url: audioUrl,
                  method: 'GET',
                  responseType: 'arraybuffer'
              });
  
              const contentType = response.headers['content-type'];
              let mimetype = 'audio/mpeg';
  
              if (contentType.includes('mp3')) {
                  mimetype = 'audio/mp3';
              } else if (contentType.includes('ogg')) {
                  mimetype = 'audio/ogg';
              } else if (contentType.includes('wav')) {
                  mimetype = 'audio/wav';
              }
  
              await conn.sendMessage(m.chat, {
                  audio: response.data,
                  mimetype: mimetype,
                  ptt: false
              }, {
                  quoted: m
              });
  
          } catch (err) {
              console.error(err);
              m.reply('Terjadi kesalahan saat mengambil suara.');
          }
      } else if (command === 'soundmeme-search') {
          if (!text) {
              return m.reply('nama?.');
          }
  
          const url = `${baseUrl}${encodeURIComponent(text)}`;
  
          try {
              const {
                  data
              } = await axios.get(url, {
                  headers: {
                      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36'
                  }
              });
  
              const $ = cheerio.load(data);
  
              const instants = $('div.instant');
  
              if (instants.length === 0) {
                  return m.reply('Suara tidak ditemukan dengan nama tersebut.');
              }
  
              let closestMatch = '';
              let bestMatchScore = 0;
  
              instants.each((index, element) => {
                  const soundName = $(element).find('.instant-link').text().trim();
                  const score = soundName.toLowerCase().includes(text.toLowerCase()) ? 1 : 0;
  
                  if (score > bestMatchScore) {
                      bestMatchScore = score;
                      closestMatch = soundName;
                  }
              });
  
              if (closestMatch) {
                  const audioUrl = `https://www.myinstants.com${$('div.instant').find('button').attr('onclick').match(/'([^']+)'/)[1]}`;
  
                  const response = await axios({
                      url: audioUrl,
                      method: 'GET',
                      responseType: 'arraybuffer'
                  });
  
                  const contentType = response.headers['content-type'];
                  let mimetype = 'audio/mpeg';
  
                  if (contentType.includes('mp3')) {
                      mimetype = 'audio/mp3';
                  } else if (contentType.includes('ogg')) {
                      mimetype = 'audio/ogg';
                  } else if (contentType.includes('wav')) {
                      mimetype = 'audio/wav';
                  }
  
                  await conn.sendMessage(m.chat, {
                      audio: response.data,
                      mimetype: mimetype,
                      ptt: false
                  }, {
                      quoted: m
                  });
  
              } else {
                  m.reply('Tidak ada suara yang mendekati nama yang di cari.');
              }
  
          } catch (err) {
              console.error(err);
              m.reply('Terjadi kesalahan saat mengambil suara.');
          }
      }
  };
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})

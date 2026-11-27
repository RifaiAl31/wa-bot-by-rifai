// religi/sholawat — satu file: metadata + kode fitur (gabungan dari engine7/plugins/religi/sholawat.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "sholawat",
  "command": [
    "sholawat",
    "shalawat",
    "selawat",
    "sholawatnabi"
  ],
  "category": "islam",
  "desc": "Kumpulan Sholawat Nabi lengkap dengan Arab, Latin, Arti, dan Keutamaan",
  "usage": ".sholawat <nama sholawat>",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/religi").split('\\').join('/')
module.exports = __vx.plugin("religi/sholawat", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/sholawat.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  
  const pluginConfig = {
      name: 'sholawat',
      alias: ['shalawat', 'selawat', 'sholawatnabi'],
      category: 'religi',
      description: 'Kumpulan Sholawat Nabi lengkap dengan Arab, Latin, Arti, dan Keutamaan',
      usage: '.sholawat <nama sholawat>',
      example: '.sholawat nariyah',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 3,
      isEnabled: true,
  };
  
  // Database Sholawat
  const SHOLAWAT_DATABASE = {
      'nariyah': {
          arab: 'اَللَّهُمَّ صَلِّ صَلَاةً كَامِلَةً وَسَلِّمْ سَلَامًا تَامًّا عَلَى سَيِّدِنَا مُحَمَّدٍ',
          latin: 'Allahumma shalli shalatan kamilatan wa sallim salaman tammam \'ala sayyidina muhammad',
          arti: 'Ya Allah, limpahkanlah sholawat yang sempurna dan salam yang sempurna kepada junjungan kami Muhammad',
          keutamaan: 'Dibaca 100x setiap hari, dijaga dari fitnah dan musibah',
          sumber: 'Habib Umar bin Hafidz'
      },
      'badar': {
          arab: 'صَلَّى اللهُ عَلَى النَّبِيِّ الْأُمِّيِّ الْهَاشِمِيِّ',
          latin: 'Shallallahu \'alan nabiyyil ummiyyil hasyimiyy',
          arti: 'Semoga Allah melimpahkan sholawat kepada Nabi yang ummi, yang berasal dari Bani Hasyim',
          keutamaan: 'Dibaca setelah sholat, mendapat syafaat Nabi SAW',
          sumber: 'Ulama Nusantara'
      },
      'munjiyat': {
          arab: 'اَللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَآلِهِ صَلَاةً تُنْجِينَا بِهَا مِنْ جَمِيعِ الْأَهْوَالِ',
          latin: 'Allahumma shalli \'ala sayyidina muhammad wa alihi shalatan tunjina biha min jami\'il ahwal',
          arti: 'Ya Allah, limpahkanlah sholawat kepada junjungan kami Muhammad dan keluarganya, yang menyelamatkan kami dari segala ketakutan',
          keutamaan: 'Dibaca saat menghadapi kesulitan, diijabah oleh Allah',
          sumber: 'Habib Ali bin Muhammad Al-Habsyi'
      },
      'tibbilqulub': {
          arab: 'اَللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ صَلَاةً تُطَهِّرُ الْقُلُوبَ',
          latin: 'Allahumma shalli wa sallim wa barik \'ala sayyidina muhammad wa \'ala alihi shalatan tuthahhirul qulub',
          arti: 'Ya Allah, limpahkanlah sholawat, salam, dan berkah kepada junjungan kami Muhammad, sholawat yang membersihkan hati',
          keutamaan: 'Menyucikan hati dari penyakit hati (dengki, iri, sombong)',
          sumber: 'Habib Umar bin Hafidz'
      },
      'adzkiya': {
          arab: 'اَللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ صَلَوَاتٍ وَسَلَامًا',
          latin: 'Allahumma shalli wa sallim wa barik \'ala sayyidina muhammad wa \'ala alihi shalawatan wa salaman',
          arti: 'Ya Allah, limpahkanlah sholawat, salam, dan berkah kepada junjungan kami Muhammad dan keluarganya dengan sholawat dan salam',
          keutamaan: 'Mempercepat terkabulnya doa',
          sumber: 'Habib Umar bin Hafidz'
      },
      'fatih': {
          arab: 'اَللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ',
          latin: 'Allahumma shalli wa sallim wa barik \'ala sayyidina muhammadil fatihi lima ughliq',
          arti: 'Ya Allah, limpahkanlah sholawat dan salam kepada junjungan kami Muhammad, yang membuka apa yang tertutup',
          keutamaan: 'Dibaca untuk membuka pintu rezeki dan kemudahan',
          sumber: 'Syekh Ahmad At-Tijani'
      }
  };
  
  async function handler(m, { sock, args, text, prefix }) {
      const p = prefix || '.';
      const query = text?.replace(new RegExp(`^\\${p}sholawat\\s*`, 'i'), '').trim();
  
      if (!query) {
          let list = '🤲 *SHOLAWAT NABI*\n\n';
          list += `Cara pakai: ${p}sholawat <nama sholawat>\n`;
          list += `Contoh: ${p}sholawat nariyah\n\n`;
          list += '📋 Daftar Sholawat:\n';
          const keys = Object.keys(SHOLAWAT_DATABASE);
          for (let i = 0; i < keys.length; i++) {
              const key = keys[i];
              list += `${i+1}. ${key.charAt(0).toUpperCase() + key.slice(1)}\n`;
          }
          list += `\n💗 WhatsApp Bot AI • ${new Date().getFullYear()}`;
          return m.reply(list);
      }
  
      const sholawatKey = query.toLowerCase();
      let sholawat = SHOLAWAT_DATABASE[sholawatKey];
  
      if (!sholawat) {
          const match = Object.keys(SHOLAWAT_DATABASE).find(key => key.includes(sholawatKey));
          if (match) {
              sholawat = SHOLAWAT_DATABASE[match];
              const foundKey = match;
              const displayKey = foundKey.charAt(0).toUpperCase() + foundKey.slice(1);
              let caption = `🤲 *SHOLAWAT ${displayKey.toUpperCase()}*\n\n`;
              caption += `📜 Arab:\n${sholawat.arab}\n\n`;
              caption += `🔤 Latin:\n${sholawat.latin}\n\n`;
              caption += `💡 Artinya:\n${sholawat.arti}\n\n`;
              caption += `✨ Keutamaan:\n${sholawat.keutamaan}\n\n`;
              caption += `📚 Sumber: ${sholawat.sumber}\n`;
              caption += `\n💗 WhatsApp Bot AI • ${new Date().getFullYear()}`;
              return m.reply(caption);
          }
          return m.reply(`❌ Sholawat "${query}" tidak ditemukan.\n\n📋 Ketik ${p}sholawat untuk melihat daftar.`);
      }
  
      const displayKey = sholawatKey.charAt(0).toUpperCase() + sholawatKey.slice(1);
      let caption = `🤲 *SHOLAWAT ${displayKey.toUpperCase()}*\n\n`;
      caption += `📜 Arab:\n${sholawat.arab}\n\n`;
      caption += `🔤 Latin:\n${sholawat.latin}\n\n`;
      caption += `💡 Artinya:\n${sholawat.arti}\n\n`;
      caption += `✨ Keutamaan:\n${sholawat.keutamaan}\n\n`;
      caption += `📚 Sumber: ${sholawat.sumber}\n`;
      caption += `\n💗 WhatsApp Bot AI • ${new Date().getFullYear()}`;
  
      await m.reply(caption);
      await m.react('🤲');
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})

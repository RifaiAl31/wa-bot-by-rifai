// owner/autogreet — satu file: metadata + kode fitur (gabungan dari engine1/plugins/owner/autogreet.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "autopagi",
  "command": [
    "autopagi",
    "automalam",
    "greet",
    "automsg",
    "pagemalam"
  ],
  "category": "owner",
  "desc": "Jadwalkan ucapan selamat pagi & malam ke kanal bot",
  "usage": ".autogreet on/off/status/test",
  "owner": true,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/autogreet", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/autogreet.js'
  const module = { exports: {} }; const exports = module.exports;
  const hsAsset = require("../../lib/ext/src/lib/assets.js");
  const { getDatabase } = require("../../lib/ext/src/lib/database.js");
  const config = require("../../lib/ext/config.js");
  const fs = require('fs');
  const path = require('path');
  const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = require("../../lib/baileys-compat.js");
  
  const pluginConfig = {
      name: ['autogreet'],
      alias: ['autopagi', 'automalam', 'greet', 'automsg', 'pagemalam'],
      category: 'owner',
      description: 'Auto kirim ucapan selamat pagi & malam ke Channel',
      usage: '.autogreet on/off/status/test',
      example: '.autogreet test',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  };
  
  // key aset di config.assets (URL diisi di config.js)
  const IMAGE = {
      pagi:   'images/vanxonepagi',
      malam:  'images/vanxonemalam',
      thumb:  'images/vx',
      thumb2: 'images/vx2',
      videoPagi:    'video/greetpagi',
      videoMalam:   'video/greetmalam',
      videoGeneric: 'video/greet'
  };
  
  function getCaption(type) {
      const isPagi = type === 'pagi';
      return isPagi
          ? `╭━━━━━━━━━━━━━━━━━━━━━━━⬣\n┃ 🌸✨ WhatsApp Bot 𝐀𝐈 ✨🌸\n┃ ── 「 𝐈𝐃𝐎𝐋 𝐌𝐎𝐃𝐄 」 ──\n╰━━━━━━━━━━━━━━━━━━━━━━━⬣\n\n╭━━━〔 🌅 𝐒𝐄𝐋𝐀𝐌𝐀𝐓 𝐏𝐀𝐆𝐈 〕━━━⬣\n┃ Ohayou semuanya ☀️\n┃ Semoga harimu penuh semangat 💖\n╰━━━━━━━━━━━━━━━━━━━━━━━⬣\n\n✨ Keep shining like an idol!`
          : `╭━━━━━━━━━━━━━━━━━━━━━━━⬣\n┃ 🌸✨ WhatsApp Bot 𝐀𝐈 ✨🌸\n┃ ── 「 𝐈𝐃𝐎𝐋 𝐌𝐎𝐃𝐄 」 ──\n╰━━━━━━━━━━━━━━━━━━━━━━━⬣\n\n╭━━━〔 🌙 𝐒𝐄𝐋𝐀𝐌𝐀𝐓 𝐌𝐀𝐋𝐀𝐌 〕━━━⬣\n┃ Oyasumi semuanya 🌌\n┃ Istirahat yang cukup ya 😴\n╰━━━━━━━━━━━━━━━━━━━━━━━⬣\n\n💫 Good night, sweet dreams`;
  }
  
  async function readImg(key) {
      try { return await hsAsset.tryBuffer(key); }
      catch { return null; }
  }
  
  async function sharpResize(buf, w, h) {
      if (!buf) return null;
      try {
          const sharp = require('sharp');
          return await sharp(buf).resize(w, h).toBuffer();
      } catch { return null; }
  }
  
  // ─────────────────────────────────────────────
  // V1 — Image + caption biasa, tanpa contextInfo
  // ─────────────────────────────────────────────
  async function sendGreetV1(sock, jid, type) {
      const isPagi = type === 'pagi';
      const imgBuf = await readImg(isPagi ? IMAGE.pagi : IMAGE.malam);
      if (!imgBuf) throw new Error(`Gambar greet ${type} belum diisi di config.assets.images!`);
  
      await sock.sendMessage(jid, {
          image: imgBuf,
          caption: getCaption(type)
      });
  }
  
  // ─────────────────────────────────────────────
  // V2 — CTA URL: tombol buka saluran + tombol WA owner
  // ─────────────────────────────────────────────
  async function sendGreetV2(sock, jid, type) { return sendGreetV1(sock, jid, type); }
  async function sendGreetV3(sock, jid, type) { return sendGreetV1(sock, jid, type); }
  async function sendGreetV4(sock, jid, type) { return sendGreetV1(sock, jid, type); }

  async function sendGreetV5(sock, jid, type) {
      const isPagi = type === 'pagi';
  
      // Coba video spesifik pagi/malam dulu, lalu fallback ke video umum
      let videoBuf = null;
      try {
          videoBuf = (await hsAsset.tryBuffer(isPagi ? IMAGE.videoPagi : IMAGE.videoMalam))
              || (await hsAsset.tryBuffer(IMAGE.videoGeneric));
      } catch { videoBuf = null; }
  
      if (!videoBuf) {
          throw new Error('File video greet tidak ditemukan! Isi URL video di config.assets.video (greetpagi / greetmalam / greet)');
      }
  
      await sock.sendMessage(jid, {
          video: videoBuf,
          gifPlayback: true,
          caption: getCaption(type),
          contextInfo: {
              forwardingScore: 9999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                  newsletterJid: config.saluran?.id || '',
                  newsletterName: config.saluran?.name || config.bot?.name || 'WhatsApp Bot',
                  serverMessageId: 127
              }
          }
      });
  }
  
  // ─────────────────────────────────────────────
  // V6 — Carousel Greet: kartu bisa di-swipe, tiap kartu punya gambar & tombol sendiri
  // ─────────────────────────────────────────────
  async function sendGreetV6(sock, jid, type) { return sendGreetV1(sock, jid, type); }
  async function sendGreetV7(sock, jid, type) { return sendGreetV1(sock, jid, type); }

  // ─────────────────────────────────────────────
  // Dispatcher — baca greetType dari getDatabase()
  // ─────────────────────────────────────────────
  async function sendGreet(sock, jid, type) {
      const db        = getDatabase();
      const greetType = db.setting('greetType') || 1;
  
      const senders = {
      1: sendGreetV1,
      2: sendGreetV2,
      3: sendGreetV3,
      4: sendGreetV4,
      5: sendGreetV5,
      6: sendGreetV6,
      7: sendGreetV7
  };
  
      const fn = senders[greetType] || sendGreetV1;
      await fn(sock, jid, type);
  }
  
  // ─────────────────────────────────────────────
  // Handler command .autogreet
  // ─────────────────────────────────────────────
  async function handler(m, { sock }) {
      const args     = m.args[0]?.toLowerCase();
      const database = getDatabase();
      const testChId = database.setting('testChannelId');
      const targetCh = testChId || config.saluran?.id;
  
      if (args === 'test') {
          m.react('🔍');
          await m.reply(`🔍 *T E S T I N G...*\n> Mengirim pratinjau ucapan...`);
          try {
              await sendGreet(sock, targetCh, 'pagi');
              await new Promise(res => setTimeout(res, 2000));
              await sendGreet(sock, targetCh, 'malam');
              const targetName =
      database.setting('testChannelName') ||
      config.saluran?.name ||
      'Channel';
  
  return m.reply(
      `✅ *TEST SUCCESS*\n` +
      `> Preview berhasil dikirim ke *${targetName}*.`
  );
          } catch (err) {
              return m.reply(`❌ *G A G A L*\n> Alasan: ${err.message}`);
          }
      }
  
      if (args === 'setpagi' || args === 'setmalam') {
          const time = m.args[1];
          if (!time || !/^\d{2}:\d{2}$/.test(time)) return m.reply(`❌ *Ehh~* Format salah! Contoh: 06:00~ 🥺`);
          const key = args === 'setpagi' ? 'autoGreetPagi' : 'autoGreetMalam';
          database.setting(key, time);
          await database.save();
          return m.reply(`✅ *Yatta~* Jam ${args.replace('set', '')} diatur ke *${time}*~ ✨`);
      }
  
      if (args === 'on') {
          database.setting('autoGreet', true);
          await database.save();
          m.react('✅');
          return m.reply(`✅ *A U T O  G R E E T I N G  A K T I F*`);
      }
  
      if (args === 'off') {
          database.setting('autoGreet', false);
          await database.save();
          m.react('❌');
          return m.reply(`❌ *A U T O  G R E E T I N G  D I N O N A K T I F K A N*`);
      }
  
      const status    = database.setting('autoGreet') ? '✅ Aktif' : '❌ Nonaktif';
      const pagi      = database.setting('autoGreetPagi')  || '05:00';
      const malam     = database.setting('autoGreetMalam') || '22:00';
      const greetType = database.setting('greetType') || 1;
  
      const VARIANT_NAMES = {
      1: 'Image + Caption biasa',
      2: 'Image + Caption',
      3: 'Image + Caption',
      4: 'Image + Caption', 
      5: 'Video Greet',
      6: 'Image + Caption',
      7: 'Image + Caption'
  };
  
      return m.reply(
          `🌅 *A U T O  G R E E T I N G*\n\n` +
          `╭┈┈⬡「 📋 *sᴛᴀᴛᴜs* 」\n` +
          `┃ 🔔 sᴛᴀᴛᴜs: ${status}\n` +
          `┃ 🌅 ᴘᴀɢɪ: ${pagi}\n` +
          `┃ 🌙 ᴍᴀʟᴀᴍ: ${malam}\n` +
          `┃ 🕐 ᴢᴏɴᴀ: Asia/Makassar ✅\n` +
          `┃ 🎨 ᴛɪᴘᴇ: V${greetType} — ${VARIANT_NAMES[greetType] || 'Unknown'}\n` +
          `╰┈┈⬡\n\n` +
          `> \`${m.prefix}autogreet on/off\`\n` +
          `> \`${m.prefix}autogreet setpagi 06:00\`\n` +
          `> \`${m.prefix}autogreet test\`\n` +
          `> \`${m.prefix}setgreettype v1~v7\` — ganti tampilan`
      );
  }
  
  // ─────────────────────────────────────────────
  // Loop Otomatis (dipanggil dari index.js)
  // ─────────────────────────────────────────────
  async function runAutoGreet(sock) {
      const db = getDatabase();
      if (!db.setting('autoGreet')) return;
  
      const now      = new Date();
      const makassar = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Makassar' }));
      const currentHour   = makassar.getHours();
      const currentMinute = makassar.getMinutes();
  
      const saluranId = config.saluran?.id;
      if (!saluranId) return;
  
      if (!global.autoGreetLock) global.autoGreetLock = { pagi: -1, malam: -1 };
  
      const pagiTime  = db.setting('autoGreetPagi')  || '05:00';
      const malamTime = db.setting('autoGreetMalam') || '22:00';
  
      const [pagiHour,  pagiMinute]  = pagiTime.split(':').map(Number);
      const [malamHour, malamMinute] = malamTime.split(':').map(Number);
  
      if (currentHour === pagiHour && currentMinute === pagiMinute) {
          if (global.autoGreetLock.pagi !== currentHour) {
              global.autoGreetLock.pagi = currentHour;
              try {
                  await sendGreet(sock, saluranId, 'pagi');
                  console.log(`[AutoGreet] ✅ Pagi terkirim ke Channel`);
              } catch (e) {
                  global.autoGreetLock.pagi = -1;
                  console.log('❌ Error AutoGreet Pagi:', e.message);
              }
          }
      } else {
          global.autoGreetLock.pagi = -1;
      }
  
      if (currentHour === malamHour && currentMinute === malamMinute) {
          if (global.autoGreetLock.malam !== currentHour) {
              global.autoGreetLock.malam = currentHour;
              try {
                  await sendGreet(sock, saluranId, 'malam');
                  console.log(`[AutoGreet] ✅ Malam terkirim ke Channel`);
              } catch (e) {
                  global.autoGreetLock.malam = -1;
                  console.log('❌ Error AutoGreet Malam:', e.message);
              }
          }
      } else {
          global.autoGreetLock.malam = -1;
      }
  }
  
  module.exports = {
      config: pluginConfig,
      handler,
      runAutoGreet
  };
  return module.exports
})

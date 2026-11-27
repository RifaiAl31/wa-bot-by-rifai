// owner/setgreettype — satu file: metadata + kode fitur (gabungan dari engine1/plugins/owner/setgreettype.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "setgreettype",
  "command": [
    "setgreettype",
    "greettype",
    "greetvariant",
    "greetstyle",
    "setgreet"
  ],
  "category": "owner",
  "desc": "Mengatur variant tampilan autogreet (pagi/malam) ke Channel",
  "usage": ".setgreettype <v1-v7>",
  "owner": true,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/setgreettype", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/setgreettype.js'
  const module = { exports: {} }; const exports = module.exports;
  const hsAsset = require("../../lib/ext/src/lib/assets.js")
  const config = require("../../lib/ext/config.js");
  const { getDatabase } = require("../../lib/ext/src/lib/database.js");
  const { generateWAMessageFromContent, proto } = require("../../lib/baileys-compat.js");
  
  const pluginConfig = {
      name: 'setgreettype',
      alias: ['greettype', 'greetvariant', 'greetstyle', 'setgreet'],
      category: 'owner',
      description: 'Mengatur variant tampilan autogreet (pagi/malam) ke Channel',
      usage: '.setgreettype <v1-v7>',
      example: '.setgreettype v2',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  };
  
  const VARIANTS = {
      v1: { id: 1, name: 'Image + Caption',      desc: 'Image biasa tanpa contextInfo' },
      v2: { id: 2, name: 'CTA URL Button',        desc: 'Tombol buka saluran & WhatsApp owner' },
      v3: { id: 3, name: 'Product Image (V10)',   desc: 'Style menu V10 — productMessage header' },
      v4: { id: 4, name: 'FakeTroli Quoted',      desc: 'Image + caption dengan quoted troli' }, 
      v5: { id: 5, name: 'Video Greet',           desc: 'Kirim video/gif singkat dengan caption greet' },
      v6: { id: 6, name: 'Carousel Greet',        desc: 'Kartu swipe-able dengan gambar & tombol masing-masing' },
      v7: { id: 7, name: 'Interactive Quoted',    desc: 'Fake quoted percakapan + tombol CTA URL' }
  };
  
  async function handler(m, { sock }) {
      const db      = getDatabase();
      const args    = m.args || [];
      const variant = args[0]?.toLowerCase();
      const current = db.setting('greetType') || 1;
  
      // Kalau ada argumen varian langsung set — persis cara setmenu
      if (variant) {
          const selected = VARIANTS[variant];
          if (!selected) {
              await m.reply(
                  `✦ *Kon-Ai~* ✦\n\n` +
                  `Eeh~ \`${variant}\` bukan variant yang Ai kenal deh~ 🌸\n` +
                  `Gunakan: \`v1\` s/d \`v7\` ya Kak~`
              );
              return;
          }
  
          db.setting('greetType', selected.id);
          await db.save();
  
          await m.reply(
              `✦ *ɢʀᴇᴇᴛ ᴅɪᴘᴇʀʙᴀʀᴜɪ~* ✦\n\n` +
              `Yay~ Ai sudah ganti tampilan greet-nya! ⭐\n\n` +
              `> 🎨 *V${selected.id} — ${selected.name}*\n` +
              `> _${selected.desc}_\n\n` +
              `_Langsung aktif tanpa restart ya Kak~ 💕_`
          );
          return;
      }
  
      // Kalau tidak ada argumen, tampilkan daftar pilihan pakai single_select — persis setmenu
      const rows = Object.entries(VARIANTS).map(([key, val]) => ({
          title: `${key.toUpperCase()}${val.id === current ? ' ✓' : ''} — ${val.name}`,
          description: val.desc,
          id: `${m.prefix}setgreettype ${key}`
      }));
  
      const bodyText =
          `✦ *sᴇᴛ ɢʀᴇᴇᴛ ᴠᴀʀɪᴀɴᴛ* ✦\n\n` +
          `Kon-Ai~ Kak *${m.pushName}*! 🌟\n` +
          `Di sini Ai bisa atur tampilan autogreet-nya~\n\n` +
          `> Variant aktif: *V${current}*\n` +
          `> _${VARIANTS[`v${current}`]?.name || 'Unknown'}_\n\n` +
          `> Pilih variant dari daftar di bawah ya~ 💕`;
  
      const saluranId   = config.saluran?.id   || '';
      const saluranName = config.saluran?.name || config.bot?.name || 'WhatsApp Bot';
  
      const buttons = [{
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
              title: '🎨 Pilih Variant Greet',
              sections: [{
                  title: '✨ Daftar Tampilan Greet',
                  rows: rows
              }]
          })
      }];
  
      const fs = require('fs');
      const thumbBuf = hsAsset.has('images/vx')
          ? (await hsAsset.buffer('images/vx'))
          : null;
  
      let headerMedia = null;
      if (thumbBuf) {
          try {
              const { prepareWAMessageMedia } = require("../../lib/baileys-compat.js");
              headerMedia = await prepareWAMessageMedia(
                  { image: thumbBuf },
                  { upload: sock.waUploadToServer }
              );
          } catch (e) {}
      }
  
      const msg = generateWAMessageFromContent(m.chat, {
          viewOnceMessage: {
              message: {
                  messageContextInfo: {
                      deviceListMetadata: {},
                      deviceListMetadataVersion: 2
                  },
                  interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                      body: proto.Message.InteractiveMessage.Body.fromObject({
                          text: bodyText
                      }),
                      footer: proto.Message.InteractiveMessage.Footer.fromObject({
                          text: `© ${config.bot?.name || 'WhatsApp Bot'}`
                      }),
                      header: proto.Message.InteractiveMessage.Header.fromObject({
                          title: config.bot?.name || 'WhatsApp Bot',
                          hasMediaAttachment: !!headerMedia,
                          ...(headerMedia || {})
                      }),
                      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                          buttons: buttons
                      }),
                      contextInfo: {
                          forwardingScore: 9999,
                          isForwarded: true,
                          forwardedNewsletterMessageInfo: {
                              newsletterJid: saluranId,
                              newsletterName: saluranName,
                              serverMessageId: 127
                          }
                      }
                  })
              }
          }
      }, { userJid: m.sender });
  
      await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  };
  return module.exports
})

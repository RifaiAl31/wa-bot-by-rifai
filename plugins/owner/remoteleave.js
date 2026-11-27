// owner/remoteleave — satu file: metadata + kode fitur (gabungan dari engine7/plugins/owner/remoteleave.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "remoteleave",
  "command": [
    "remoteleave",
    "leavegroupbot"
  ],
  "category": "owner",
  "desc": "Memilih grup tertentu untuk bot tinggalkan dari satu menu",
  "usage": ".remoteleave",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/remoteleave", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/remoteleave.js'
  const __vxExports = {};
  const { generateWAMessageFromContent } = require("@whiskeysockets/baileys");
  
  const pluginConfig = {
    name: 'remoteleave',
    alias: ['leavegroupbot'],
    category: 'owner',
    description: 'Memilih grup tertentu untuk bot tinggalkan dari satu menu',
    usage: '.remoteleave',
    example: '.remoteleave',
    isOwner: true,
    cooldown: 10,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { sock, text, prefix }) {
    if (!m.isOwner && !m.isCreator) return m.reply('❌ Fitur ini hanya untuk owner.');
  
    try {
      const groups = Object.values(await sock.groupFetchAllParticipating());
      if (!groups.length) return m.reply('❌ Bot tidak terdaftar di grup manapun.');
  
      const requested = (text || '').trim();
      if (requested) {
        const target = groups.find((g) => g.id === requested);
        if (!target) return m.reply('❌ ID grup tidak ditemukan pada daftar grup bot.');
  
        await m.reply(`🚪 Meninggalkan *${target.subject || 'grup'}*...`);
        await sock.groupLeave(target.id);
        return;
      }
  
      const rows = groups.slice(0, 100).map((g) => ({
        title: (g.subject || 'Grup').slice(0, 28),
        description: `${(g.participants || []).length} member • ${g.id}`,
        id: `${prefix || '.'}remoteleave ${g.id}`,
      }));
  
      const sections = [];
      for (let i = 0; i < rows.length; i += 10) {
        sections.push({ title: `Grup ${i + 1}–${Math.min(i + 10, rows.length)}`, rows: rows.slice(i, i + 10) });
      }
  
      const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
            interactiveMessage: {
              body: {
                text:
                  `🚪 *ʀᴇᴍᴏᴛᴇ ʟᴇᴀᴠᴇ*\n\n` +
                  `Total grup: *${groups.length}*\n` +
                  `Pilih grup yang ingin ditinggalkan bot.\n\n` +
                  `⚠️ *Aksi tidak dapat dibatalkan.*`,
              },
              nativeFlowMessage: {
                buttons: [{
                  name: 'single_select',
                  buttonParamsJson: JSON.stringify({
                    title: 'PILIH GRUP',
                    sections,
                  }),
                }],
              },
            },
          },
        },
      }, { quoted: m }, {});
  
      await sock.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
    } catch (e) {
      return m.reply(`❌ *Remote leave gagal:* ${String(e.message).slice(0, 180)}`);
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})

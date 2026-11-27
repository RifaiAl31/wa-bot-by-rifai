import { rbRun, rbRegister } from '../../lib/engine/plugins.js'
import { buttonsToText } from '../../lib/platform/wa.js'

// ───────── logika fitur (sebelumnya di lib/) ─────────
const feature = async ({ rbG, rbLib }) => {
  const axios = (__m => __m.default ?? __m)((await import('axios')))
  const BASE_URL = 'https://smsku.zelapi.eu.cc/api';
  const activePolls = (globalThis.__nokosPolls ||= new Map());
  const owners = (globalThis.__nokosOwners ||= new Map());
  const OWNER_TTL = 6 * 60 * 60 * 1000;

  const myNumbers = (m) => {
    const now = Date.now();
    const out = [];
    for (const [num, v] of owners) {
      if (now - v.at > OWNER_TTL) { owners.delete(num); continue; }
      if (v.sender === m.sender) out.push(num);
    }
    return out;
  };

  const sendBtn = async (sock, m, body, buttons, footer) => {
    try {
      return await sock.sendButtons(m.chat, {
        text: body,
        footer: footer || global.namebot || 'ZELAPI Nokos',
        buttons: buttons.slice(0, 10)
      }, { quoted: m });
    } catch {
      const extra = buttonsToText(buttons);
      return sock.sendMessage(m.chat, { text: extra ? `${body}\n\n${extra}` : body }, { quoted: m });
    }
  };

  // lepas satu nomor ke server + bersihkan pemantauan
  const releaseOne = async (numClean) => {
    if (activePolls.has(numClean)) {
      clearInterval(activePolls.get(numClean));
      activePolls.delete(numClean);
    }
    const { data } = await axios.post(`${BASE_URL}/release_number`, {
      number: numClean
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000
    });
    if (data && data.success) {
      owners.delete(numClean);
      return true;
    }
    throw new Error(data?.error || 'ɢᴀɢᴀʟ melepaskan nomor.');
  };

  const handler = async (m, { sock, text, args, command, reply, usedPrefix, prefix }) => {
    const cmd = command.toLowerCase();
    const p = usedPrefix ?? prefix ?? '.';

    try {
      if (cmd === 'lepasnokos' || cmd === 'releasenokos') {
        // tanpa nomor → pilihan nomor milik user
        if (!text) {
          const list = myNumbers(m);
          if (!list.length) {
            return sendBtn(sock, m,
              '❌ Masukkan nomor yang akan dilepas!\n*ᴄᴏɴᴛᴏʜ:* `' + p + 'lepasnokos 6288269202428`\n\nBelum ada nomor aktif atas nama kamu.',
              [
                { type: 'reply', text: '🇮🇩 Nokos Indonesia (+62)', id: `${p}nokosid` },
                { type: 'reply', text: '🎲 Gacha Nokos', id: `${p}gachanokos` },
                { type: 'copy', text: '📋 Salin Format', code: `${p}lepasnokos 6288269202428` }
              ]);
          }
          const buttons = [{
            type: 'list',
            text: '🗑 Pilih Nomor',
            sections: [{
              title: 'Nomor kamu',
              rows: list.slice(0, 10).map(n => ({ title: `+${n}`, description: 'Lepas nomor ini', id: `${p}releasenokos ${n}` }))
            }]
          }];
          if (list.length > 1) buttons.push({ type: 'reply', text: `🗑 Lepas Semua (${list.length})`, id: `${p}releasenokos all` });
          return sendBtn(sock, m, `🗑 *LEPAS NOMOR*\n\nPilih nomor yang mau dilepas.`, buttons);
        }

        // lepas semua nomor milik user
        if (text.trim().toLowerCase() === 'all' || text.trim().toLowerCase() === 'semua') {
          const list = myNumbers(m);
          if (!list.length) return reply('ℹ️ Tidak ada nomor aktif atas nama kamu.');
          await reply(`⏳ Melepaskan ${list.length} nomor...`);
          let ok = 0;
          const failed = [];
          for (const n of list) {
            try { await releaseOne(n); ok++; } catch { failed.push(n); }
          }
          return sendBtn(sock, m,
            `✅ *${ok}/${list.length}* nomor berhasil dilepaskan.` +
            (failed.length ? `\n\n❌ Gagal:\n${failed.map(n => `• +${n}`).join('\n')}` : ''),
            [
              { type: 'reply', text: '🇮🇩 Nokos Baru (+62)', id: `${p}nokosid` },
              { type: 'reply', text: '🎲 Gacha Nokos', id: `${p}gachanokos` }
            ]);
        }

        const numClean = text.replace(/\D/g, '');
        if (numClean.length < 8 || numClean.length > 15) {
          return reply('❌ Nomor tidak valid.\n*ᴄᴏɴᴛᴏʜ:* `' + p + 'lepasnokos 6288269202428`');
        }
        await reply(`⏳ Melepaskan nomor +${numClean}...`);
        await releaseOne(numClean);

        return sendBtn(sock, m, `✅ Nomor +${numClean} berhasil dilepaskan.`, [
          { type: 'reply', text: '🇮🇩 Nokos Baru (+62)', id: `${p}nokosid` },
          { type: 'reply', text: '🎲 Gacha Nokos', id: `${p}gachanokos` },
          { type: 'reply', text: '📊 Stok ZELAPI', id: `${p}statzelapi` }
        ]);
      }

    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Terjadi kesalahan sistem.';
      const num = (text || '').replace(/\D/g, '');
      return sendBtn(sock, m, `❌ *Error:* ${errorMsg}`, num
        ? [{ type: 'reply', text: '🔄 Coba Lagi', id: `${p}releasenokos ${num}` }]
        : [{ type: 'reply', text: '🎲 Gacha Nokos', id: `${p}gachanokos` }]);
    }
  };

  handler.help = ['releasenokos <nomor|all>', 'lepasnokos <nomor|all>'];
  handler.tags = ['gacha-nokos', 'gacha']
  handler.command = ['releasenokos', 'lepasnokos']
  handler.limit = true;
  return handler
}

rbRegister("gacha-nokos/releasenokos", feature)

let handler = (m, ctx) => rbRun("gacha-nokos/releasenokos", m, ctx)

handler.command = ['releasenokos', 'lepasnokos']
handler.help = ["releasenokos <nomor|all>", "lepasnokos <nomor|all>"]
handler.tags = ['gacha-nokos']

export default handler

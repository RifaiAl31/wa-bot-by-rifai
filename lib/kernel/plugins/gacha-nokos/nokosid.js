import { rbRun, rbRegister } from '../../lib/engine/plugins.js'
import { buttonsToText } from '../../lib/platform/wa.js'
import { trackRequest, trackNumber, trackOtp, trackUserNumber, trackUserOtp } from '../../lib/services/nokostraffic.js'

// ───────── logika fitur: nokos Indonesia (+62) ─────────
const feature = async ({ rbG, rbLib }) => {
  const axios = (__m => __m.default ?? __m)((await import('axios')))
  const BASE_URL = 'https://smsku.zelapi.eu.cc/api';
  const activePolls = (globalThis.__nokosPolls ||= new Map());
  const owners = (globalThis.__nokosOwners ||= new Map());

  const MAX_ATTEMPTS = 6;   // maksimal percobaan minta nomor sampai dapat +62

  const claim = (num, m) => owners.set(num, { sender: m.sender, chat: m.chat, at: Date.now() });

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

  const releaseNumber = async (numClean) => {
    try {
      await axios.post(`${BASE_URL}/release_number`, { number: numClean }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000
      });
    } catch (_) {}
  };

  async function pollOtp(sock, m, numClean, p, maxMinutes = 3) {
    if (activePolls.has(numClean)) {
      clearInterval(activePolls.get(numClean));
    }

    const startTime = Date.now();
    const maxTime = maxMinutes * 60 * 1000;

    const intervalId = setInterval(async () => {
      try {
        if (Date.now() - startTime > maxTime) {
          clearInterval(intervalId);
          activePolls.delete(numClean);
          await sendBtn(sock, m,
            `⏱️ *WAKTU OTP HABIS*\n\n📞 Nomor: +${numClean}\nWaktu tunggu ${maxMinutes} menit telah berakhir. OTP belum diterima.`,
            [
              { type: 'reply', text: '🔄 Cek OTP Manual', id: `${p}cekotp ${numClean}` },
              { type: 'reply', text: '🗑 Lepas Nomor', id: `${p}releasenokos ${numClean}` },
              { type: 'reply', text: '🇮🇩 Nokos Baru (+62)', id: `${p}nokosid` }
            ]);
          return;
        }

        const { data } = await axios.get(`${BASE_URL}/latest_otp`, {
          params: { number: numClean },
          timeout: 10000
        });

        if (data && data.success && data.has_otp && data.otp_code) {
          clearInterval(intervalId);
          activePolls.delete(numClean);
          trackOtp('Indonesia');
          trackUserOtp(numClean);
          await sendBtn(sock, m,
            `🎉 *KODE OTP MASUK OTOMATIS!*\n\n` +
            `📞 *Nomor:* +${numClean}\n` +
            `🔑 *Kode OTP:* \`${data.otp_code}\`\n\n` +
            `💡 Segera gunakan kode OTP ini!`,
            [
              { type: 'copy', text: '📋 Salin OTP', code: String(data.otp_code) },
              { type: 'copy', text: '📋 Salin Nomor', code: numClean },
              { type: 'reply', text: '🗑 Lepas Nomor', id: `${p}releasenokos ${numClean}` },
              { type: 'reply', text: '🇮🇩 Nokos Baru (+62)', id: `${p}nokosid` }
            ]);
        }
      } catch (e) {}
    }, 5000);

    activePolls.set(numClean, intervalId);
  }

  // minta 1 nomor Indonesia, pastikan awalan 62; kalau bukan, lepas & coba lagi
  async function requestIndoNumber(service) {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const res = await axios.post(`${BASE_URL}/request_number`, {
          service,
          country: 'Indonesia'
        }, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 20000
        });
        const data = res.data;
        trackRequest('Indonesia', !!(data && data.success && data.number));
        if (!data || !data.success || !data.number) continue;

        const numClean = String(data.number).replace(/\D/g, '');
        if (numClean.startsWith('62')) {
          return { number: numClean, id: data.id, attempt };
        }
        // bukan +62 → kembalikan ke pool
        await releaseNumber(numClean);
      } catch (_) {}
      await new Promise(r => setTimeout(r, 500));
    }
    return null;
  }

  const handler = async (m, { sock, text, args, command, reply, usedPrefix, prefix }) => {
    const cmd = command.toLowerCase();
    const p = usedPrefix ?? prefix ?? '.';

    try {
      if (cmd === 'nokosid' || cmd === 'nokos62' || cmd === 'nomorid') {
        let count = 1;
        if (args && args.length > 0) {
          const n = parseInt(args[0]);
          if (!isNaN(n) && n > 0) count = Math.min(5, Math.max(1, n));
        }

        await reply(`🇮🇩 Mencari ${count} nomor Indonesia (+62)...`);

        const results = [];
        for (let i = 0; i < count; i++) {
          const got = await requestIndoNumber('WhatsApp');
          if (!got) continue;

          let isRegistered = false;
          try {
            const [waCheck] = await sock.onWhatsApp(got.number + '@s.whatsapp.net');
            isRegistered = !!(waCheck && waCheck.exists);
          } catch (_) {}

          results.push({ number: got.number, registered: isRegistered });
          trackNumber('Indonesia', { registered: isRegistered });
          claim(got.number, m);
          trackUserNumber(m.sender, got.number, 'Indonesia');
          pollOtp(sock, m, got.number, p);

          if (i < count - 1) await new Promise(r => setTimeout(r, 500));
        }

        if (results.length === 0) {
          throw new Error('Nomor Indonesia (+62) sedang habis atau server tidak mengembalikan nomor +62. Coba lagi nanti.');
        }

        let resText = `🇮🇩 *NOKOS INDONESIA +62 (${results.length})*\n\n`;
        const buttons = [];

        results.forEach((item, idx) => {
          const regStatus = item.registered ? '✅ Sudah terdaftar di WA' : '🆕 Belum terdaftar di WA';
          resText += `*${idx + 1}.* \`+${item.number}\`\n`;
          resText += `   └ ${regStatus}\n\n`;
        });

        results.slice(0, 5).forEach((item, idx) => {
          buttons.push({
            type: 'copy',
            code: item.number,
            text: `📋 Salin #${idx + 1}`
          });
        });

        buttons.push({
          type: 'reply',
          text: '🔄 Cari Lagi',
          id: `${p}nokosid ${results.length}`
        });

        buttons.push({
          type: 'list',
          text: '⚙️ Kelola Nomor',
          sections: [
            {
              title: '📩 Cek OTP',
              rows: results.slice(0, 10).map((item, idx) => ({
                title: `#${idx + 1} +${item.number}`,
                description: 'Cek OTP terbaru',
                id: `${p}cekotp ${item.number}`
              }))
            },
            {
              title: '🗑 Lepas Nomor',
              rows: results.slice(0, 10).map((item, idx) => ({
                title: `#${idx + 1} +${item.number}`,
                description: 'Kembalikan nomor ke server',
                id: `${p}releasenokos ${item.number}`
              }))
            }
          ]
        });

        buttons.push({ type: 'reply', text: '🚦 Cek Traffic', id: `${p}traffic` });

        return await sendBtn(sock, m, resText.trim(), buttons, '📌 Auto OTP aktif 3 menit');
      }

    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Terjadi kesalahan sistem.';
      return sendBtn(sock, m, `❌ *Error:* ${errorMsg}`, [
        { type: 'reply', text: '🔄 Coba Lagi', id: `${p}nokosid ${args?.[0] || ''}`.trim() },
        { type: 'reply', text: '🌍 Negara Lain', id: `${p}statzelapi` }
      ]);
    }
  };

  handler.help = ['nokosid [jumlah]'];
  handler.tags = ['gacha-nokos', 'gacha']
  handler.command = ['nokosid', 'nokos62', 'nomorid']
  handler.limit = 4
  return handler
}

rbRegister("gacha-nokos/nokosid", feature)

let handler = (m, ctx) => rbRun("gacha-nokos/nokosid", m, ctx)

handler.command = ['nokosid', 'nokos62', 'nomorid']
handler.help = ["nokosid [jumlah]"]
handler.tags = ['gacha-nokos']
handler.limit = 4

export default handler

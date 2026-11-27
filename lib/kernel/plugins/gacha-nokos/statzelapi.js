import { rbRun, rbRegister } from '../../lib/engine/plugins.js'
import { buttonsToText } from '../../lib/platform/wa.js'

// ───────── logika fitur: statistik & pilih negara ZELAPI ─────────
const feature = async ({ rbG, rbLib }) => {
  const axios = (__m => __m.default ?? __m)((await import('axios')))
  const BASE_URL = 'https://smsku.zelapi.eu.cc/api';

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

  const handler = async (m, { sock, text, args, command, reply, usedPrefix, prefix }) => {
    const p = usedPrefix ?? prefix ?? '.';

    try {
      await reply('📊 Mengambil data ZELAPI...');

      const [statRes, countryRes] = await Promise.allSettled([
        axios.get(`${BASE_URL}/stats/detailed`, { params: { period: 'daily' }, timeout: 10000 }),
        axios.get(`${BASE_URL}/countries`, { params: { service: 'WhatsApp' }, timeout: 10000 })
      ]);

      const stats = statRes.status === 'fulfilled' ? statRes.value.data : null;
      const countries = (countryRes.status === 'fulfilled' && countryRes.value.data?.success && Array.isArray(countryRes.value.data.countries))
        ? countryRes.value.data.countries
        : [];

      if (!stats && !countries.length) {
        throw new Error('Server ZELAPI tidak merespons. Coba lagi nanti.');
      }

      let out = `📊 *STATISTIK ZELAPI*\n\n`;
      if (stats && stats.otp_count !== undefined) {
        out += `📩 OTP masuk (harian): *${stats.otp_count}*\n`;
        out += `🌍 Negara: *${stats.countries_count}*\n`;
        out += `🧩 Layanan: *${stats.services_count}*\n`;
        out += `📞 Nomor tersedia: *${stats.available_numbers}*\n`;
      } else {
        out += `_Statistik tidak tersedia saat ini._\n`;
      }

      const buttons = [];
      if (countries.length) {
        const sorted = [...countries].sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, 20);
        out += `\n🌍 *Stok WhatsApp per negara* (top ${sorted.length})\nPilih negara untuk gacha 3 nomor.`;

        const toRow = (c) => {
          const name = c.name || c.code;
          const isId = String(name).toLowerCase() === 'indonesia';
          return {
            title: `${isId ? '🇮🇩 ' : ''}${name}`.slice(0, 24),
            description: `${c.count ?? '?'} nomor${isId ? ' • pastikan +62' : ''}`,
            id: isId ? `${p}nokosid 3` : `${p}gachanokos ${name} 3`
          };
        };
        const rows = sorted.map(toRow);
        const sections = [{ title: 'Pilih negara', rows: rows.slice(0, 10) }];
        if (rows.length > 10) sections.push({ title: 'Negara lainnya', rows: rows.slice(10, 20) });

        buttons.push({ type: 'list', text: '🌍 Pilih Negara', sections });
      }

      buttons.push({ type: 'reply', text: '🇮🇩 Nokos Indonesia (+62)', id: `${p}nokosid` });
      buttons.push({ type: 'reply', text: '🚦 Cek Traffic', id: `${p}traffic` });
      buttons.push({ type: 'reply', text: '🎲 Gacha Acak', id: `${p}gachanokos` });
      buttons.push({ type: 'reply', text: '🔄 Refresh', id: `${p}statzelapi` });

      return await sendBtn(sock, m, out.trim(), buttons);

    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Terjadi kesalahan sistem.';
      return sendBtn(sock, m, `❌ *Error:* ${errorMsg}`, [
        { type: 'reply', text: '🔄 Coba Lagi', id: `${p}statzelapi` }
      ]);
    }
  };

  handler.help = ['statzelapi'];
  handler.tags = ['gacha-nokos', 'gacha']
  handler.command = ['statzelapi']
  handler.limit = true;
  return handler
}

rbRegister("gacha-nokos/statzelapi", feature)

let handler = (m, ctx) => rbRun("gacha-nokos/statzelapi", m, ctx)

handler.command = ['statzelapi']
handler.help = ["statzelapi"]
handler.tags = ['gacha-nokos']
handler.limit = true

export default handler

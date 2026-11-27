import { rbRun, rbRegister } from '../../lib/engine/plugins.js'
import { buttonsToText } from '../../lib/platform/wa.js'
import { rankCountries, gradeOf, getHistory } from '../../lib/services/nokostraffic.js'

// ───────── logika fitur: traffic nokos per negara (biar gacha tidak buta) ─────────
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

  const bar = (score) => '█'.repeat(Math.round(score / 10)) + '░'.repeat(10 - Math.round(score / 10));
  const pct = (v) => v === null || v === undefined ? '-' : `${Math.round(v * 100)}%`;

  const handler = async (m, { sock, text, args, command, reply, usedPrefix, prefix }) => {
    const p = usedPrefix ?? prefix ?? '.';

    try {
      await reply('🚦 Mengambil data traffic ZELAPI...');

      const [statRes, countryRes] = await Promise.allSettled([
        axios.get(`${BASE_URL}/stats/detailed`, { params: { period: 'daily' }, timeout: 10000 }),
        axios.get(`${BASE_URL}/countries`, { params: { service: 'WhatsApp' }, timeout: 10000 })
      ]);

      const stats = statRes.status === 'fulfilled' ? statRes.value.data : null;
      const countries = (countryRes.status === 'fulfilled' && countryRes.value.data?.success && Array.isArray(countryRes.value.data.countries))
        ? countryRes.value.data.countries
        : [];

      if (!countries.length) throw new Error('Data negara ZELAPI tidak tersedia. Coba lagi nanti.');

      const ranked = rankCountries(countries);
      if (!ranked.length) throw new Error('Semua negara sedang kehabisan nomor.');

      // detail 1 negara: .traffic indonesia
      const q = (text || '').trim().toLowerCase();
      if (q && !/^\d+$/.test(q)) {
        const c = ranked.find(x => String(x.name).toLowerCase() === q) || ranked.find(x => String(x.name).toLowerCase().includes(q));
        if (!c) throw new Error(`Negara "${text.trim()}" tidak ditemukan / stok kosong.`);
        const h = getHistory(c.name);
        const out =
          `🚦 *TRAFFIC ${String(c.name).toUpperCase()}*\n\n` +
          `${gradeOf(c.score)}  ${bar(c.score)} *${c.score}/100*\n` +
          `📞 Stok nomor: *${c.count ?? '?'}*\n` +
          (h
            ? `🎲 Gacha dari bot: *${h.req}* percobaan, *${h.ok}* dapat nomor (${pct(h.okRate)})\n` +
              `✅ Terdaftar WA: ${pct(h.regRate)}\n` +
              `📩 OTP masuk: *${h.otp}* (${pct(h.otpRate)} dari nomor)\n` +
              `📅 Hari ini: ${h.today.req} request • ${h.today.ok} nomor • ${h.today.otp} OTP\n` +
              (h.jam !== null ? `📮 Rata-rata anti-jam: ${h.jam}%\n` : '')
            : `_Belum ada riwayat gacha untuk negara ini._\n`);
        return sendBtn(sock, m, out.trim(), [
          { type: 'reply', text: `🎲 Gacha ${c.name} x3`, id: `${p}gachanokos ${c.name} 3` },
          { type: 'reply', text: '🚦 Semua Traffic', id: `${p}traffic` },
          { type: 'reply', text: '📊 Stok ZELAPI', id: `${p}statzelapi` }
        ]);
      }

      const top = ranked.slice(0, 10);
      let out = `🚦 *TRAFFIC NOKOS WHATSAPP*\n\n`;
      if (stats && stats.otp_count !== undefined) {
        out += `📩 OTP masuk hari ini: *${stats.otp_count}*\n`;
        out += `📞 Nomor tersedia: *${stats.available_numbers}*\n\n`;
      }
      top.forEach((c, i) => {
        const h = c.history;
        out += `*${i + 1}.* ${c.name} — ${gradeOf(c.score)}\n`;
        out += `   └ ${bar(c.score)} *${c.score}* | 📞 ${c.count ?? '?'} nomor`;
        if (h && h.ok) out += ` | 📩 OTP ${pct(h.otpRate)}`;
        out += `\n`;
      });
      out += `\n_Skor = stok nomor + OTP masuk + keberhasilan dapat nomor. Makin tinggi makin enak digacha._`;

      const buttons = [
        { type: 'reply', text: `🏆 Gacha ${top[0].name} x3`, id: `${p}gachanokos ${top[0].name} 3` },
        { type: 'reply', text: '🤖 Gacha Otomatis', id: `${p}gachanokos auto 3` },
        {
          type: 'list',
          text: '🌍 Pilih Negara',
          sections: [{
            title: 'Top traffic',
            rows: top.map(c => ({
              title: String(c.name).slice(0, 24),
              description: `${gradeOf(c.score)} • skor ${c.score} • ${c.count ?? '?'} nomor`.slice(0, 72),
              id: `${p}gachanokos ${c.name} 3`
            }))
          }]
        },
        { type: 'reply', text: '🇮🇩 Nokos Indonesia (+62)', id: `${p}nokosid` },
        { type: 'reply', text: '🔄 Refresh', id: `${p}traffic` }
      ];

      return await sendBtn(sock, m, out.trim(), buttons, '🚦 Traffic ZELAPI');

    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Terjadi kesalahan sistem.';
      return sendBtn(sock, m, `❌ *Error:* ${errorMsg}`, [
        { type: 'reply', text: '🔄 Coba Lagi', id: `${p}traffic ${text || ''}`.trim() },
        { type: 'reply', text: '📊 Stok ZELAPI', id: `${p}statzelapi` }
      ]);
    }
  };

  handler.help = ['traffic [negara]'];
  handler.tags = ['gacha-nokos', 'gacha']
  handler.command = ['traffic', 'trafficnokos', 'trafficgacha']
  handler.limit = true;
  return handler
}

rbRegister("gacha-nokos/traffic", feature)

let handler = (m, ctx) => rbRun("gacha-nokos/traffic", m, ctx)

handler.command = ['traffic', 'trafficnokos', 'trafficgacha']
handler.help = ["traffic [negara]"]
handler.tags = ['gacha-nokos']
handler.limit = true

export default handler

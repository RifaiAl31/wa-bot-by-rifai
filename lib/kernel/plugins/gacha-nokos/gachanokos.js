import { rbRun, rbRegister } from '../../lib/engine/plugins.js'
import { buttonsToText } from '../../lib/platform/wa.js'
import { trackRequest, trackNumber, trackOtp, trackUserNumber, trackUserOtp, pickWeighted, pickBest } from '../../lib/services/nokostraffic.js'

// ───────── logika fitur (sebelumnya di lib/) ─────────
const feature = async ({ rbG, rbLib }) => {
  const axios = (__m => __m.default ?? __m)((await import('axios')))
  const { getJamPercentage, checkMetaBusiness } = (await rbLib('cekbio'))

  const BASE_URL = 'https://smsku.zelapi.eu.cc/api';
  const activePolls = (globalThis.__nokosPolls ||= new Map());
  const owners = (globalThis.__nokosOwners ||= new Map());

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

  async function pollOtp(sock, m, numClean, p, maxMinutes = 3, country = '') {
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
              { type: 'reply', text: '🎲 Gacha Lagi', id: `${p}gachanokos` }
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
          if (country) trackOtp(country);
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
              { type: 'reply', text: '🎲 Gacha Lagi', id: `${p}gachanokos` }
            ]);
        }
      } catch (e) {}
    }, 5000);

    activePolls.set(numClean, intervalId);
  }


  const handler = async (m, { sock, text, args, command, reply, usedPrefix, prefix }) => {
    const cmd = command.toLowerCase();
    const p = usedPrefix ?? prefix ?? '.';

    try {
      if (cmd === 'gachanokos') {
        let countryInput = text ? text.trim() : '';
        let count = 3;

        if (args && args.length > 0) {
          const lastArgNum = parseInt(args[args.length - 1]);
          if (!isNaN(lastArgNum) && lastArgNum > 0) {
            count = Math.min(10, Math.max(1, lastArgNum));
            countryInput = args.slice(0, -1).join(' ').trim();
          }
        }

        let targetCountries = [];
        try {
          const cRes = await axios.get(`${BASE_URL}/countries?service=WhatsApp`, { timeout: 10000 });
          if (cRes.data && cRes.data.success && Array.isArray(cRes.data.countries)) {
            targetCountries = cRes.data.countries;
          }
        } catch (e) {}

        // mode: kosong = acak berbobot traffic, "auto"/"top" = negara paling ramai, "acak" = acak murni
        const mode = countryInput.toLowerCase();
        const bestMode = mode === 'auto' || mode === 'top' || mode === 'best';
        const randomMode = mode === 'acak' || mode === 'random';
        if (bestMode || randomMode) countryInput = '';

        const results = [];
        let pickedLabel = '';
        for (let i = 0; i < count; i++) {
          let selectedCountry = countryInput;
          try {
            if (!selectedCountry && targetCountries.length > 0) {
              const pick = randomMode
                ? targetCountries[Math.floor(Math.random() * targetCountries.length)]
                : (bestMode ? pickBest(targetCountries) : pickWeighted(targetCountries)) || targetCountries[0];
              selectedCountry = pick.name || pick.code || 'TG';
              if (!randomMode && pick.score !== undefined && !pickedLabel) pickedLabel = `${selectedCountry} (skor ${pick.score})`;
            }
            if (!selectedCountry) selectedCountry = 'TG';

            let reqPayload = { service: 'WhatsApp', country: selectedCountry };
            let res = await axios.post(`${BASE_URL}/request_number`, reqPayload, {
              headers: { 'Content-Type': 'application/json' },
              timeout: 20000
            });

            let data = res.data;
            if ((!data || !data.success || !data.number) && targetCountries.length > 0) {
              for (const cItem of targetCountries) {
                const fallbackC = cItem.name || cItem.code;
                try {
                  const fbRes = await axios.post(`${BASE_URL}/request_number`, {
                    service: 'WhatsApp',
                    country: fallbackC
                  }, {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 15000
                  });
                  if (fbRes.data && fbRes.data.success && fbRes.data.number) {
                    data = fbRes.data;
                    selectedCountry = fallbackC;
                    break;
                  }
                } catch (_) {}
              }
            }

            trackRequest(selectedCountry, !!(data && data.success && data.number));

            if (data && data.success && data.number) {
              const numClean = data.number.replace(/\D/g, '');
              let isRegistered = false;
              let bioText = "";
              let setAt = null;
              let metaBusiness = false;

              try {
                const jid = numClean + '@s.whatsapp.net';
                const [waCheck] = await sock.onWhatsApp(jid);
                if (waCheck && waCheck.exists) {
                  isRegistered = true;
                  try {
                    const statusResult = await sock.fetchStatus(jid);
                    let rawStatus = Array.isArray(statusResult) ? statusResult[0]?.status || statusResult[0] : statusResult?.status || statusResult;
                    if (rawStatus && typeof rawStatus === 'object') {
                      bioText = rawStatus.status !== undefined ? String(rawStatus.status) : (rawStatus.text !== undefined ? String(rawStatus.text) : "");
                      if (rawStatus.setAt) setAt = new Date(rawStatus.setAt);
                    } else if (typeof rawStatus === 'string') {
                      bioText = rawStatus;
                    }
                  } catch (_) {}

                  try {
                    const busCheck = await checkMetaBusiness(sock, jid);
                    metaBusiness = busCheck.isBusiness;
                  } catch (_) {}
                }
              } catch (_) {}

              const jamPct = getJamPercentage(bioText, setAt, metaBusiness);

              results.push({
                number: numClean,
                registered: isRegistered,
                bio: bioText,
                setAt: setAt,
                metaBusiness: metaBusiness,
                jamPercentage: jamPct,
                country: data.country || selectedCountry
              });

              trackNumber(selectedCountry, { registered: isRegistered, jam: jamPct });
              claim(numClean, m);
              trackUserNumber(m.sender, numClean, selectedCountry);
              pollOtp(sock, m, numClean, p, 3, selectedCountry);
            }
          } catch (err) {
            console.error(`ɢᴀɢᴀʟ request nomor ke-${i + 1}:`, err.message);
          }
          if (i < count - 1) {
            await new Promise(r => setTimeout(r, 500));
          }
        }

        if (results.length === 0) {
          throw new Error('Nomor pada server ZELAPI saat ini sedang habis.');
        }

        let resText = `🎉 *GACHA NOKOS & CEK BIO (${results.length})*\n`;
        resText += pickedLabel ? `🌍 Negara pilihan traffic: *${pickedLabel}*\n\n` : `\n`;
        const buttons = [];

        results.forEach((item, idx) => {
          const regStatus = item.registered ? '✅ Terdaftar' : '❌ Belum Terdaftar';
          const bioInfo = item.bio ? `"${item.bio}"` : 'Tanpa Bio';
          const busInfo = item.metaBusiness ? ' MetaBiz' : '';

          resText += `*${idx + 1}.* \`+${item.number}\`\n`;
          resText += `   └ ${regStatus} | 📝 ${bioInfo}${busInfo}\n`;
          resText += `   └ 📮 ${item.jamPercentage}% Anti-Jam\n\n`;
        });

        // batas WhatsApp 10 tombol: salin nomor maks 5, sisanya aksi
        results.slice(0, 5).forEach((item, idx) => {
          buttons.push({
            type: 'copy',
            code: item.number,
            text: `📋 Salin #${idx + 1}`
          });
        });

        buttons.push({
          type: 'reply',
          text: '🔄 Gacha Lagi',
          id: `${p}gachanokos ${countryInput} ${results.length}`.replace(/\s+/g, ' ').trim()
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

        buttons.push({
          type: 'reply',
          text: '🚦 Cek Traffic',
          id: `${p}traffic`
        });

        return await sendBtn(sock, m, resText.trim(), buttons, '📌 Auto OTP aktif 3 menit');
      }

    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Terjadi kesalahan sistem.';
      return sendBtn(sock, m, `❌ *Error:* ${errorMsg}`, [
        { type: 'reply', text: '🔄 Coba Lagi', id: `${p}gachanokos ${text || ''}`.trim() },
        { type: 'reply', text: '🌍 Ganti Negara', id: `${p}statzelapi` },
        { type: 'reply', text: '🇮🇩 Nokos Indonesia (+62)', id: `${p}nokosid` }
      ]);
    }
  };

  handler.help = ['gachanokos [negara|auto|acak] [jumlah]'];
  handler.tags = ['gacha-nokos', 'gacha']
  handler.command = ['gachanokos']
  handler.limit = 4
  return handler
}

rbRegister("gacha-nokos/gachanokos", feature)

let handler = (m, ctx) => rbRun("gacha-nokos/gachanokos", m, ctx)

handler.command = ['gachanokos']
handler.help = ["gachanokos [negara|auto|acak] [jumlah]"]
handler.tags = ['gacha-nokos']
handler.limit = 4

export default handler

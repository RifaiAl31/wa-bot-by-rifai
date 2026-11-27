// tools/nftoken — Netflix token generator (kunci API di settings.js: global.apiKeys.vamx)
const axios = require('axios');

module.exports = {
  name: 'nftoken',
  command: ['nftoken', 'netflixtoken', 'nftv'],
  category: 'tools',
  desc: 'Netflix Token Generator',
  usage: '<cookie>',
  run: async ({ sock, msg, from, sender, args, text, prefix, reply }) => {
    let q = (text || '').trim();

    try {
      await sock.sendMessage(from, { react: { text: '⏳', key: msg.key } });

      const { data } = await axios.post(
        'https://vamxapi.my.id/api/v1/tools/netflix-token',
        { cookie: q || '' },
        {
          headers: {
            'x-api-key': process.env.VAMX_API_KEY || (global.apiKeys && global.apiKeys.vamx) || '',
            'Content-Type': 'application/json'
          },
          timeout: 90000
        }
      );

      if (!data || data.status === false) {
        await sock.sendMessage(from, { react: { text: '❌', key: msg.key } });
        return reply('Gagal: ' + (data && data.message ? data.message : 'Respons tidak valid'));
      }

      const r = data.result || data.data || data;
      const nftoken = r.nftoken || r.token || '-';
      const links = r.links || r.urls || {};
      const pc = links.pc || r.pc || r.pcLink || '-';
      const android = links.android || r.android || r.androidLink || '-';
      const tv = links.tv || links.smarttv || r.tv || r.smartTvLink || '-';

      // CUMA INI YANG DIRAPIHIN, ISI SAMA PERSIS
      let caption = `╭─── *NETFLIX TOKEN* ───\n`;
      caption += `│ ✅ *Berhasil Dibuat*\n`;
      caption += `│\n`;
      caption += `│ *NFToken:*\n`;
      caption += `│ ${nftoken}\n`;
      caption += `│\n`;
      caption += `│ *Auto Login Links:*\n`;
      caption += `│ 💻 PC : ${pc}\n`;
      caption += `│ 📱 Android : ${android}\n`;
      caption += `│ 📺 Smart TV : ${tv}\n`;
      caption += `╰───────────────────`;

      if (r.cookie) caption += `\n\n*Cookie:* ${String(r.cookie).slice(0, 40)}...`;

      await sock.sendMessage(from, { react: { text: '✅', key: msg.key } });
      return reply(caption);
    } catch (err) {
      console.error(err);
      await sock.sendMessage(from, { react: { text: '❌', key: msg.key } });
      return reply('Error: ' + ((err.response && err.response.data && err.response.data.message) || err.message || err));
    }
  }
};
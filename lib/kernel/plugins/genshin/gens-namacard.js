// ───────── gens-namacard ─────────
// Dipecah dari plugins/game/genshin.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdGensNamacard = rpgCmd(["gens-namacard"], async (A) => {
    const { isBan, XRB, XReaction, text, reply, vanxone } = A
    const genshindb = await A.loadGenshin().catch(() => null)
    if (!genshindb) return A.reply('Modul *genshin-db* belum terpasang. Jalankan: npm i genshin-db')
    switch (0) {
        default:
            {
            if (isBan) return XRB()
            await XReaction()
              if (!text) return reply(`Contoh: *${vanxone} anemo flare*\nHarap berikan nama kartu nama.`);
              try {
                let result = await genshindb.namecards(text);
                if (result) {
                  let response = `*Kartu Nama Ditemukan: ${result.name}*\n\n`;
                  response += `_${result.description || "Deskripsi tidak tersedia"}_\n\n`;
                  response += `*Rarity:* ${result.rarity || "Data tidak tersedia"}\n`;
                  response += `*Unlock:* ${result.unlock || "Data tidak tersedia"}`;
                  reply(response);
                } else {
                 reply("Kartu nama tidak ditemukan.");
                }
              } catch (error) {
                console.error(error);
                let available = await genshindb.namecards("names", {
                  matchCategories: true
                });
                reply(`*Tidak Ditemukan*\n\n*Kartu nama yang tersedia:* ${available.join(", ")}`);
              }
            };
            break
    }
}, { tags: 'genshin' })

// satu command = nama file
export default oneCommand(cmdGensNamacard, 'gens-namacard')

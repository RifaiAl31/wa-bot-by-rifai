// ───────── gens-nation ─────────
// Dipecah dari plugins/game/genshin.js (dulu digabung dengan fitur lain dalam satu file)

import { rpgCmd } from '../../lib/rpg/bridge.js'
import { oneCommand } from '../../lib/engine/plugins.js'

const cmdGensNation = rpgCmd(["gens-nation"], async (A) => {
    const { isBan, XRB, XReaction, text, reply, vanxone } = A
    const genshindb = await A.loadGenshin().catch(() => null)
    if (!genshindb) return A.reply('Modul *genshin-db* belum terpasang. Jalankan: npm i genshin-db')
    switch (0) {
        default:
            {
            if (isBan) return XRB()
            await XReaction()
            if (!text) return reply(`Contoh: *${vanxone} mondstadt*\nHarap berikan nama wilayah atau nasionalitas.`);
              try {
                let result = await genshindb.geographies(text);
                if (result) {
                  let response = `*Informasi Wilayah Ditemukan: ${result.name}*\n\n`;
                  response += `_${result.description || "Deskripsi tidak tersedia"}_\n\n`;
                  response += `*Area:* ${result.area || "Data tidak tersedia"}\n`;
                  response += `*Region:* ${result.region || "Data tidak tersedia"}`;
                  reply(response);
                } else {
                  reply("Informasi wilayah tidak ditemukan.");
                }
              } catch (error) {
                console.error(error);
                let available = await genshindb.geographies("names", {
                  matchCategories: true
                });
                reply(`*Tidak Ditemukan*\n\n*Wilayah yang tersedia:* ${available.join(", ")}`);
              }
            };
            break
    }
}, { tags: 'genshin' })

// satu command = nama file
export default oneCommand(cmdGensNation, 'gens-nation')

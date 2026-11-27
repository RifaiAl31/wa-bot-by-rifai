// rpg/minecraftbattle — satu file: metadata + kode fitur (gabungan dari engine7/plugins/rpg/minecraftbattle.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "minecraftbattle",
  "command": [
    "minecraftbattle"
  ],
  "category": "rpg",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/rpg").split('\\').join('/')
module.exports = __vx.plugin("rpg/minecraftbattle", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/minecraftbattle.js'
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  let { MessageType } = (await Promise.resolve().then(() => __vxNs(require("../../lib/baileys-compat.mjs")))).default
  
  function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
  }
  
  const pluginConfig = {
    name: "minecraftbattle",
    alias: [],
    category: "rpg",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
      const conn = sock;
    try {
      // Inisialisasi database global
      global.db.data = global.db.data || {}
      global.db.data.users = global.db.data.users || {}
      global.db.data.monsters = global.db.data.monsters || [
        'Zombi', 'Creeper', 'Skeleton', 'Enderman',
        'Spider', 'Ghast', 'Blaze', 'Witch'
      ]
      global.db.data.items = global.db.data.items || [
        'Kayu', 'Batu', 'Besi', 'Emas',
        'Diamond', 'Netherite', 'Emerald', 'Redstone'
      ]
  
      let user = global.db.data.users[m.sender]
      if (!user) global.db.data.users[m.sender] = user = {}
  
      // Inisialisasi properti user jika belum ada
      if (user.health == null) user.health = 100
      if (user.maxHealth == null) user.maxHealth = 100
      if (!Array.isArray(user.items)) user.items = []
      if (user.exp == null) user.exp = 0
      if (user.money == null) user.money = 0
  
      if (user.health <= 0) {
        return conn.reply(m.chat, '😓 Anda tidak memiliki nyawa. Pulihkan dulu sebelum bertarung.', m)
      }
  
      const selectedMonster = pickRandom(global.db.data.monsters)
      let monsterHealth = 50
      let monsterAttack = 10
      let round = 1
      let message = `🗡️ Anda bertemu dengan *${selectedMonster}*!\n`
      message += `❤️ Kesehatan Anda: ${user.health}/${user.maxHealth}\n`
      message += `❤️ Kesehatan ${selectedMonster}: ${monsterHealth}\n\n`
  
      // Pertarungan
      while (user.health > 0 && monsterHealth > 0 && round <= 10) {
        let userAttack = Math.floor(Math.random() * 20) + 1
        monsterHealth -= userAttack
  
        let damageToUser = monsterAttack
        user.health -= damageToUser
  
        message += `🏴‍☠️ *Ronde ${round}*:\n`
        message += `👤 Serangan Anda: ${userAttack}\n`
        message += `👻 Serangan ${selectedMonster}: ${damageToUser}\n`
        message += `❤️ Anda: ${Math.max(user.health, 0)}/${user.maxHealth}\n`
        message += `❤️ ${selectedMonster}: ${Math.max(monsterHealth, 0)}\n\n`
  
        if (monsterHealth <= 0) {
          let expReward = Math.floor(Math.random() * 100) + 50
          let moneyReward = Math.floor(Math.random() * 50) + 10
          user.exp += expReward
          user.money += moneyReward
          message += `🎉 *Kemenangan!*\n💰 +${moneyReward} Money\n🌟 +${expReward} Exp\n`
          break
        }
  
        if (user.health <= 0) {
          message += `😵 *Kamu kalah!*\nPulihkan kesehatanmu dulu.\n`
          break
        }
  
        round++
      }
  
      if (round > 10) {
        message += `⚠️ Pertarungan dihentikan setelah 10 ronde.\n`
      }
  
      await conn.reply(m.chat, message, m)
  
    } catch (e) {
      console.error(e)
      conn.reply(m.chat, '❌ Terjadi kesalahan, coba lagi nanti.', m)
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})

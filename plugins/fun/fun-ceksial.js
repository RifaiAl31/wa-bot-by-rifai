// fun/fun-ceksial — satu file: metadata + kode fitur (gabungan dari engine2/plugins/fun/fun-ceksial.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "sialcheck"
  ],
  "category": "fun",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur sialcheck (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/fun-ceksial", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/fun-ceksial.js'
  const __vxExports = {};
  const { generateFunCard } = require("../../lib/ext/lib/canvas-fun.js");
  
  const getCleanTag = (jid) => {
    if (!jid) return ''
    return String(jid).split('@')[0].split(':')[0]
  }
  
  const getTarget = async (m, text, client) => {
    let targetJid = null
    let targetName = ''
  
    if (m.mentionedJid && m.mentionedJid.length > 0) {
      targetJid = m.mentionedJid[0]
    } else if (m.quoted && m.quoted.sender) {
      targetJid = m.quoted.sender
    } else if (text && text.trim().length > 0) {
      const cleanNum = text.replace(/[^0-9]/g, '')
      if (cleanNum.length >= 7 && cleanNum.length <= 15) {
        targetJid = cleanNum + '@s.whatsapp.net'
      } else {
        targetName = text.trim()
      }
    } else {
      targetJid = m.sender
    }
  
    let cardName = targetName
    let captionTag = targetName
  
    if (targetJid) {
      const cleanTag = getCleanTag(targetJid)
      captionTag = `@${cleanTag}`
  
      if (!cardName) {
        let foundName = null
        try {
          foundName = client.getName ? await client.getName(targetJid) : null
        } catch {}
        if (!foundName && global.db?.data?.users?.[targetJid]?.name) {
          foundName = global.db.data.users[targetJid].name
        }
        if (foundName && foundName !== 'User' && !/^\d+$/.test(foundName)) {
          cardName = foundName
        } else if (targetJid === m.sender && m.pushName) {
          cardName = m.pushName
        } else {
          cardName = `@${cleanTag}`
        }
      }
    }
  
    return { targetJid, targetName: cardName, captionTag: captionTag || cardName }
  }
  
  const getPercentage = () => Math.floor(Math.random() * 101)
  
  const getAnalysis = (pct) => {
    let comment = '', categoryVal = ''
    if (pct > 85) { comment = 'Sial abadi! Beli es krim aja jatuh ke lantai!'; categoryVal = 'Apes Abadi 😭' }
    else if (pct > 60) { comment = 'Sering kena sial kecil seperti kejatuhan cicak.'; categoryVal = 'Sering Apes 🫣' }
    else if (pct > 30) { comment = 'Kadang sial kadang untung, hidup imbang.'; categoryVal = 'Standar Imbang ☯️' }
    else { comment = 'Keberuntungan 100%! Hoki tiada tanding!'; categoryVal = 'Maha Hoki 🍀' }
    return { comment, categoryVal }
  }
  
  let handler = async (m, { conn, sock, text }) => {
    const client = conn || sock
    const { targetJid, targetName, captionTag } = await getTarget(m, text, client)
    const percentage = getPercentage()
    const { comment, categoryVal } = getAnalysis(percentage)
  
    let ppUrl = null
    if (targetJid && client?.profilePictureUrl) {
      try { ppUrl = await client.profilePictureUrl(targetJid, 'image').catch(() => null) } catch (_) {}
    }
  
    const cardBuffer = await generateFunCard({
      title: '💀 CEK TINGKAT KESIALAN',
      badgeText: `⛈️ ${percentage}% SIAL`,
      titleBg: '#475569',
      badgeBg: '#ffea00',
      name: targetName,
      rate: percentage,
      categoryLabel: 'Level Kesialan',
      categoryValue: categoryVal,
      descLabel: 'Catatan Analisis',
      descValue: comment,
      footerText: 'Banyak-banyak beramal biar dijauhkan dari marabahaya!',
      barColor: '#64748b',
      ppUrl
    }).catch(() => null)
  
    const caption = `🎯 *HASIL CHECK* 🎯\n\n• 👤 *Target:* ${captionTag}\n• 📊 *Persentase:* *${percentage}%*\n• 🏷️ *Status:* ${categoryVal}\n• 💬 *Catatan:* _"${comment}"_`
  
    await client?.sendMessage(m.chat, { react: { text: '💀', key: m.key } }).catch(() => null)
  
    const mentions = targetJid ? [targetJid] : []
    if (cardBuffer) {
      return client.sendMessage(m.chat, {
        image: cardBuffer,
        caption,
        mentions
      }, { quoted: m })
    } else {
      return client.sendMessage(m.chat, {
        text: caption,
        mentions
      }, { quoted: m })
    }
  }
  
  handler.help = ['ceksial']
  handler.tags = ['fun']
  handler.command = /^(ceksial|sialcheck)$/i
  handler.limit = true
  handler.register = true
  
  const __vxDefault = handler
  
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})

const { generateWAMessageFromContent } = require('@whiskeysockets/baileys')

const MAX_TAGS = 20

function randomGroupJid() {
  const a = 120363000000000000n + BigInt(Math.floor(Math.random() * 1e12))
  const b = BigInt(Date.now() % 1e9) * 1000n + BigInt(Math.floor(Math.random() * 999))
  return `${a + b}@g.us`
}

function tidy(s) {
  return String(s || '')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function cleanName(n) {
  return String(n || '').replace(/^@+/, '').replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, '').trim()
}

function parsePipe(input) {
  if (!input.includes('|')) return null
  const parts = input.split('|').map(s => s.trim())
  if (parts.length < 2) return null
  const tags = []
  let prefix = '', suffix = ''
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (!part) continue
    const at = part.lastIndexOf('@')
    if (at === -1) {
      if (i === 0 && !tags.length) prefix = part
      else suffix = suffix ? `${suffix} ${part}` : part
      continue
    }
    const before = part.slice(0, at).replace(/[ \t]+$/g, '')
    const name = cleanName(part.slice(at + 1))
    if (!name) continue
    if (i === 0 && before) prefix = before
    tags.push(name)
  }
  if (!tags.length) return null
  return { prefix, tags, suffix, sep: input.includes('\n') ? '\n' : ' ' }
}

function parseLines(input) {
  const lines = String(input).split(/\r?\n/)
  const tags = [], preLines = [], sufLines = []
  let seenTag = false
  for (const line of lines) {
    const t = line.trim()
    if (!t) {
      if (seenTag) sufLines.push('')
      else preLines.push('')
      continue
    }
    if (t.startsWith('@')) {
      const name = cleanName(t)
      if (name) { tags.push(name); seenTag = true }
      continue
    }
    if (seenTag) sufLines.push(line)
    else preLines.push(line)
  }
  if (!tags.length) return null
  return { prefix: preLines.join('\n').trimEnd(), tags, suffix: sufLines.join('\n').trimStart(), sep: '\n' }
}

function parseLegacy(input) {
  if (input.includes('|')) {
    const i = input.indexOf('|')
    const nama = cleanName(input.slice(0, i))
    const pesan = input.slice(i + 1).trim()
    if (!nama) return null
    return { tags: [nama], pesan }
  }
  const one = input.trim()
  if (one.startsWith('@') || !one.includes('\n')) {
    const nama = cleanName(one.split(/\r?\n/)[0])
    if (!nama) return null
    return { tags: [nama], pesan: '' }
  }
  return null
}

function buildMentions(tags) {
  return tags.slice(0, MAX_TAGS).map(name => ({
    groupJid: randomGroupJid(),
    groupSubject: name
  }))
}

function buildText(prefix, mentions, suffix, sep) {
  const mentionText = sep === '\n'
    ? mentions.map(m => `@${m.groupJid}`).join('\n')
    : mentions.map(m => `@${m.groupJid}`).join(' ')
  let out = ''
  const p = String(prefix || '')
  const s = String(suffix || '')
  if (p) {
    out = p
    if (sep === '\n') { if (!out.endsWith('\n')) out += '\n' }
    else if (!/[\s\n]$/.test(out)) out += ' '
  }
  out += mentionText
  if (s) {
    if (sep === '\n') { if (!out.endsWith('\n')) out += '\n'; out += s }
    else { if (!/^\s/.test(s) && !/[\s\n]$/.test(out)) out += ' '; out += s }
  }
  return tidy(out)
}

function getRawText(msg, text, prefix, commandName) {
  // ambil teks asli biar enter / newline ga ilang
  const content = msg?.message || {}
  const raw = content.extendedTextMessage?.text || content.conversation || content.imageMessage?.caption || content.videoMessage?.caption || ''
  if (raw) {
    // buang prefix + command
    const cleaned = String(raw).replace(new RegExp(`^\\${prefix}\\S+\\s*`, ''), '')
    if (cleaned.trim()) return cleaned
  }
  return String(text || '')
}

module.exports = {
  name: 'faketag',
  command: ['faketag', 'ftag'],
  category: 'tools',
  desc: 'Fake tag grup: .faketag @A|@B|@C atau .faketag Nama | pesan',
  usage: '<@nama|@nama2|teks>',
  // owner: false,
  run: async ({ sock, msg, from, sender, args, text, prefix, reply }) => {
    const react = async (emoji) => {
      try { await sock.sendMessage(from, { react: { text: emoji, key: msg.key } }) } catch {}
    }

    const input = getRawText(msg, text, prefix, 'faketag').trim()

    if (!input) {
      return reply(
        `*Multi (|):*\n${prefix}faketag join @Mark|@Meta| teks\n\n` +
        `*Multi (baris):*\n${prefix}faketag @Mark Zuckerberg\n@Elon Musk\n@Messi\n\n` +
        `*Satu tag:*\n${prefix}faketag Mark Zuckerberg | halo`
      )
    }

    let groupMentions = []
    let textBody = ''

    const pipe = parsePipe(input)
    const lines = !pipe ? parseLines(input) : null

    if (pipe && pipe.tags.length) {
      groupMentions = buildMentions(pipe.tags)
      textBody = buildText(pipe.prefix, groupMentions, pipe.suffix, pipe.sep)
    } else if (lines && lines.tags.length) {
      groupMentions = buildMentions(lines.tags)
      textBody = buildText(lines.prefix, groupMentions, lines.suffix, lines.sep)
    } else {
      const leg = parseLegacy(input)
      if (!leg) return reply('❌ Nama tag kosong.')
      groupMentions = buildMentions(leg.tags)
      textBody = leg.pesan
        ? buildText('', groupMentions, leg.pesan, ' ')
        : groupMentions.map(mm => `@${mm.groupJid}`).join(' ')
    }

    if (!groupMentions.length) return reply('❌ Tidak ada tag terdeteksi.')

    await react('🕕')

    try {
      const genMsg = generateWAMessageFromContent(from, {
        extendedTextMessage: {
          text: textBody,
          previewType: 0,
          contextInfo: {
            mentionedJid: [],
            groupMentions,
            statusAttributions: []
          }
        }
      }, { userJid: sock.user.id })

      await sock.relayMessage(from, genMsg.message, { messageId: genMsg.key.id })
      await react('✅')
    } catch (e) {
      console.error('[faketag WhatsApp Bot]', e)
      await react('❌')
      return reply(`❌ ${String(e?.message || e).slice(0, 160)}`)
    }
  }
}
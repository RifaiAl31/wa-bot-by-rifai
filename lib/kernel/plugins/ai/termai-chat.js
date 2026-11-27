// AI chat via Termai: .gpt3 / .deepseek / .bard
import { gpt, deepseek, bard } from '../../lib/services/termai.js'
import { reactTo } from '../../lib/core/file.js'

const MODELS = {
  gpt: { title: 'GPT-3', run: gpt },
  gpt3: { title: 'GPT-3', run: gpt },
  deepseek: { title: 'DEEPSEEK-R1', run: deepseek },
  'deepseek-r1': { title: 'DEEPSEEK-R1', run: deepseek },
  bard: { title: 'BARD GOOGLE', run: bard },
  bardai: { title: 'BARD GOOGLE', run: bard }
}

let handler = async (m, { sock, text, prefix, command, reply }) => {
  const model = MODELS[String(command).toLowerCase()]
  const query = String(text || m.quoted?.text || '').trim()
  if (!query) return reply(`Mau tanya apa?\n\n*Contoh:*\n${prefix || '.'}${command} buatkan puisi tentang hujan`)
  try {
    await reactTo(sock, m, '⏳')
    const answer = String(await model.run(query) || '').trim()
    if (!answer) throw new Error('API tidak mengembalikan jawaban.')
    await reactTo(sock, m, '✅')
    return reply(`[ ${model.title} ]\n${answer}`)
  } catch (e) {
    console.error('[TERMAI-CHAT]', e)
    await reactTo(sock, m, '❌')
    return reply(`❌ Gagal: ${e?.message || e}`)
  }
}

handler.command = Object.keys(MODELS)
handler.help = ['gpt3 <pertanyaan>', 'deepseek <pertanyaan>', 'bard <pertanyaan>']
handler.tags = ['ai']
handler.limit = true

export default handler

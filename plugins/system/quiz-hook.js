// Hook jawaban game tebak-tebakan (tanpa prefix)
const Q = require("../../lib/adapter/quiz.js")
module.exports = {
  name: 'vanxone-quiz-hook',
  hook: true,
  passive: async ({ sock, msg, from, sender, body, prefix }) => {
    if (!Q.games.has(from) || msg.key.fromMe || !body || body.startsWith(prefix)) return false
    return Q.answer(sock, from, sender, msg, body)
  }
}

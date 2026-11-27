// fitur tambahan WhatsApp Bot (asisten/pomodoro)
module.exports = require('../../lib/adapter/e9.js').plugin("asisten/pomodoro", {"command":["pomodoro","pomo","fokus","stoppomodoro"],"category":"tools","desc":"Pomodoro: .pomodoro [fokus] [istirahat] • .pomodoro status • .pomodoro stop","usage":".pomodoro"})

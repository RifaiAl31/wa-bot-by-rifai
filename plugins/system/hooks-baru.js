// Fitur _hooks tambahan (jawaban game, keamanan grup) — dipasang bersama fitur baru dari plugins.zip
module.exports = require("../../lib/adapter/e2.js").hook([
  "vxnew/events/group_security",
  "vxnew/game/cc-sd_ans",
  "vxnew/game/kabupaten_ans",
  "vxnew/game/karakter-freefire_ans",
  "vxnew/game/tebakkartun_ans"
])

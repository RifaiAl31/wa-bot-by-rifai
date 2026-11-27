// fitur tambahan WhatsApp Bot (asisten/todo)
module.exports = require('../../lib/adapter/e9.js').plugin("asisten/todo", {"command":["todo"],"category":"tools","desc":"Daftar tugas pribadi: .todo add <tugas> • done <no> • del <no> • edit <no> <teks> • clear","usage":".todo"})

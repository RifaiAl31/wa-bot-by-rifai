// Fitur _hooks — kode inti di engine/engine8
module.exports = require("../../lib/adapter/e8.js").hook([
  {
    "rel": "game/mobastrategi",
    "fns": [
      "answerHandler"
    ]
  },
  {
    "rel": "game/sambungkata",
    "fns": [
      "answerHandler"
    ]
  },
  {
    "rel": "other/tebakml",
    "fns": [
      "answerHandler"
    ]
  },
  {
    "rel": "game/caklontong",
    "fns": [
      "answerHandler"
    ]
  },
  {
    "rel": "game/riddle",
    "fns": [
      "answerHandler"
    ]
  }
])

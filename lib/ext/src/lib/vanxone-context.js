'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxUrl = require('url').pathToFileURL(__filename).href;
const __vxExports = {};
const fs = __vxDef(require("fs"));
const path = __vxDef(require("path"));
const config = __vxDef(require("../../config.e3.js"));
const { fileURLToPath } = require("url");


const axios = __vxDef(require("axios"));
const { getAssetBuffer } = require("./vanxone-asset-manager.js");

let gameThumbBuffer = null;
let rpgThumbBuffer = null;
let winnerThumbBuffer = null;

const keys = [
  ["vanxone-games", (buf) => { gameThumbBuffer = buf; }],
  ["vanxone-rpg", (buf) => { rpgThumbBuffer = buf; }],
  ["vanxone-winner", (buf) => { winnerThumbBuffer = buf; }],
];
for (const [key, setter] of keys) {
  const buf = getAssetBuffer(key);
  if (buf) setter(buf);
}

const FAST_ANSWER_PRAISES = [
  "⚡ Kilat banget! Kamu jenius!",
  "🚀 Super cepat! Otak encer!",
  "🔥 Wuih monster! Jawab secepat kilat!",
  "💫 Luar biasa! Kamu the flash!",
  "🎯 Precision tinggi! Langsung tepat!",
  "⭐ Bintang! Refleks dewa!",
  "🏆 Legend! Kecepatan maximal!",
  "🏆 Pemain tangguh! Gak ada lawan!",
  "🦅 Tajam seperti elang!",
  "🧠 Big brain! IQ tinggi detected!",
];

const FAST_ANSWER_THRESHOLD = 4000;
const FAST_ANSWER_BONUS = {
  exp: 50,
  balance: 500,
  limit: 1,
};

function getRandomPraise() {
  return FAST_ANSWER_PRAISES[
    Math.floor(Math.random() * FAST_ANSWER_PRAISES.length)
  ];
}

function _saluranCtx() {
  const saluranId = config.saluran?.id || "";
  const saluranName = config.saluran?.name || config.bot?.name || "WhatsApp Bot";
  return {
    forwardingScore: 9,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: saluranId,
      newsletterName: saluranName,
      serverMessageId: 127,
    },
  };
}

function getGameContextInfo() {
  return _saluranCtx();
}

function getWinnerContextInfo() {
  return _saluranCtx();
}

function getRpgContextInfo(title, body) {
  const base = _saluranCtx();
  if (title || body) {
    base.externalAdReply = {
      title: title || config.bot?.name || "WhatsApp Bot RPG",
      body: body || "",
      sourceUrl: config.saluran?.link || "",
      mediaType: 1,
      renderLargerThumbnail: false,
      thumbnail: rpgThumbBuffer,
    };
  }
  return base;
}

async function sendGamePreview(sock, jid, text, title, body, options) {
  const msgId = await sock.sendPreview(
    jid,
    {
      caption: `${config.info.website} ${text}`,
      url: `${config.info.website}`,
      title: title || "🎮 WhatsApp Bot GAMES",
      description: body || "Have fun playing!",
      jpegThumbnail: gameThumbBuffer,
      previewType: 0,
    },
    { contextInfo: _saluranCtx(), ...options },
  );
  return { key: { id: msgId, remoteJid: jid, fromMe: true } };
}

async function sendWinnerPreview(sock, jid, text, title, body, options) {
  const msgId = await sock.sendPreview(
    jid,
    {
      caption: `${config.info.website} ${text}`,
      url: `${config.info.website}`,
      title: title || "🏆 WINNER!",
      description: body || "Selamat kamu menang!",
      jpegThumbnail: winnerThumbBuffer || gameThumbBuffer,
      previewType: 0,
    },
    { contextInfo: _saluranCtx(), ...options },
  );
  return { key: { id: msgId, remoteJid: jid, fromMe: true } };
}

async function sendRpgPreview(sock, jid, text, title, body, options) {
  const msgId = await sock.sendPreview(
    jid,
    {
      caption: `${config.info.website} ${text}`,
      url: `${config.info.website}`,
      title: title || "⚔️ WhatsApp Bot RPG",
      description: body || "Adventure awaits!",
      jpegThumbnail: rpgThumbBuffer,
      previewType: 0,
    },
    { contextInfo: _saluranCtx(), ...options },
  );
  return { key: { id: msgId, remoteJid: jid, fromMe: true } };
}

async function sendToolsPreview(sock, jid, text, title, body, options) {
  const msgId = await sock.sendPreview(
    jid,
    {
      caption: `${config.info.website} ${text}`,
      url: `${config.info.website}`,
      title: title || "🛠️ WhatsApp Bot TOOLS",
      description: body || "Utility & tools",
      jpegThumbnail: gameThumbBuffer,
      previewType: 0,
    },
    { contextInfo: _saluranCtx(), ...options },
  );
  return { key: { id: msgId, remoteJid: jid, fromMe: true } };
}

function saluranCtx() {
  return _saluranCtx();
}

function checkFastAnswer(session) {
  if (!session?.startTime) return { isFast: false };

  const elapsed = Date.now() - session.startTime;

  if (elapsed <= FAST_ANSWER_THRESHOLD) {
    return {
      isFast: true,
      elapsed: elapsed,
      praise: getRandomPraise(),
      bonus: FAST_ANSWER_BONUS,
    };
  }

  return { isFast: false, elapsed: elapsed };
}

function createFakeQuoted(botName = "WhatsApp Bot", verified = true) {
  return {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
    },
    message: {
      contactMessage: {
        displayName: verified ? `✅ ${botName}` : botName,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${botName}\nORG:${verified ? "Verified Bot" : "Bot"}\nEND:VCARD`,
      },
    },
  };
}



Object.defineProperty(__vxExports, "getGameContextInfo", { enumerable: true, get: () => getGameContextInfo });
Object.defineProperty(__vxExports, "getWinnerContextInfo", { enumerable: true, get: () => getWinnerContextInfo });
Object.defineProperty(__vxExports, "getRpgContextInfo", { enumerable: true, get: () => getRpgContextInfo });
Object.defineProperty(__vxExports, "sendGamePreview", { enumerable: true, get: () => sendGamePreview });
Object.defineProperty(__vxExports, "sendWinnerPreview", { enumerable: true, get: () => sendWinnerPreview });
Object.defineProperty(__vxExports, "sendRpgPreview", { enumerable: true, get: () => sendRpgPreview });
Object.defineProperty(__vxExports, "sendToolsPreview", { enumerable: true, get: () => sendToolsPreview });
Object.defineProperty(__vxExports, "saluranCtx", { enumerable: true, get: () => saluranCtx });
Object.defineProperty(__vxExports, "createFakeQuoted", { enumerable: true, get: () => createFakeQuoted });
Object.defineProperty(__vxExports, "checkFastAnswer", { enumerable: true, get: () => checkFastAnswer });
Object.defineProperty(__vxExports, "getRandomPraise", { enumerable: true, get: () => getRandomPraise });
Object.defineProperty(__vxExports, "gameThumbBuffer", { enumerable: true, get: () => gameThumbBuffer });
Object.defineProperty(__vxExports, "rpgThumbBuffer", { enumerable: true, get: () => rpgThumbBuffer });
Object.defineProperty(__vxExports, "winnerThumbBuffer", { enumerable: true, get: () => winnerThumbBuffer });
Object.defineProperty(__vxExports, "FAST_ANSWER_THRESHOLD", { enumerable: true, get: () => FAST_ANSWER_THRESHOLD });
Object.defineProperty(__vxExports, "FAST_ANSWER_BONUS", { enumerable: true, get: () => FAST_ANSWER_BONUS });
Object.defineProperty(__vxExports, "FAST_ANSWER_PRAISES", { enumerable: true, get: () => FAST_ANSWER_PRAISES });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));

'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
const __vxExports = {};
const QRCode = __vxDef(require("qrcode"));
const path = __vxDef(require("path"));
const fs = __vxDef(require("fs"));
const { saluranCtx } = require("./vanxone-context.e7.js");
const { delay, DisconnectReason, jidNormalizedUser, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const { logger } = require("./vanxone-logger.e7.js");
const { addJadibotOwner } = require("./vanxone-jadibot-database.js");
const { extendSocket } = require("./vanxone-socket.js");
const { getAssetBuffer } = require("./vanxone-asset-manager.e7.js");
const JADIBOT_AUTH_FOLDER = path.join(process.cwd(), "session", "jadibot");
const jadibotSessions = new Map();
const reconnectAttempts = new Map();
const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_INTERVAL = 5000;

if (!fs.existsSync(JADIBOT_AUTH_FOLDER)) {
  fs.mkdirSync(JADIBOT_AUTH_FOLDER, { recursive: true });
}

function getJadibotAuthPath(jid) {
  const id = jid.replace(/@.+/g, "");
  return path.join(JADIBOT_AUTH_FOLDER, id);
}

function isJadibotActive(jid) {
  const id = jid.replace(/@.+/g, "");
  return jadibotSessions.has(id);
}

function getActiveJadibots() {
  return Array.from(jadibotSessions.entries()).map(([id, data]) => ({
    id,
    jid: id + "@s.whatsapp.net",
    ...data,
  }));
}

function getAllJadibotSessions() {
  const sessions = [];
  if (!fs.existsSync(JADIBOT_AUTH_FOLDER)) return sessions;

  const dirs = fs.readdirSync(JADIBOT_AUTH_FOLDER);
  for (const dir of dirs) {
    const credsPath = path.join(JADIBOT_AUTH_FOLDER, dir, "creds.json");
    if (fs.existsSync(credsPath)) {
      sessions.push({
        id: dir,
        jid: dir + "@s.whatsapp.net",
        isActive: jadibotSessions.has(dir),
        credsPath,
      });
    }
  }
  return sessions;
}

function createJadibotStore() {
  return {
    messages: new Map(),
    chats: new Map(),
    contacts: {},
    bind(ev) {
      ev.on("messages.upsert", ({ messages }) => {
        for (const msg of messages || []) {
          const jid = msg.key?.remoteJid;
          if (!jid) continue;
          if (!this.messages.has(jid)) this.messages.set(jid, new Map());
          const chat = this.messages.get(jid);
          if (msg.key?.id) {
            chat.set(msg.key.id, msg);
            if (chat.size > 200) {
              const keys = [...chat.keys()];
              for (let i = 0; i < keys.length - 150; i++) chat.delete(keys[i]);
            }
          }
          if (!this.chats.has(jid)) {
            this.chats.set(jid, { id: jid });
          }
          if (msg.pushName && jid.endsWith("@s.whatsapp.net")) {
            this.contacts[jid] = {
              ...this.contacts[jid],
              notify: msg.pushName,
            };
          }
        }
      });
      ev.on("chats.upsert", (chats) => {
        for (const chat of chats || []) {
          if (chat.id) this.chats.set(chat.id, chat);
        }
      });
      ev.on("contacts.upsert", (contacts) => {
        for (const contact of contacts || []) {
          if (contact.id) {
            this.contacts[contact.id] = {
              ...this.contacts[contact.id],
              ...contact,
            };
          }
        }
      });
    },
    async loadMessage(jid, id) {
      return this.messages.get(jid)?.get(id) || undefined;
    },
  };
}

const rateLimit = new Map();

const ERROR_MESSAGES = {
  401: {
    reason: "Nomor tidak terdaftar WhatsApp",
    action: "Pastikan nomor ini aktif di WhatsApp",
    fatal: true,
  },
  403: {
    reason: "Akses ditolak/dibanned",
    action: "Nomor ini mungkin terkena banned WhatsApp",
    fatal: true,
  },
  405: {
    reason: "Metode tidak diizinkan",
    action: "Coba lagi nanti",
    fatal: true,
  },
  406: {
    reason: "Nomor dibatasi",
    action: "Nomor ini dibatasi oleh WhatsApp, tunggu beberapa jam",
    fatal: true,
  },
  408: {
    reason: "Request timeout",
    action: "Koneksi lambat, akan mencoba reconnect",
    fatal: false,
  },
  409: {
    reason: "Konflik session",
    action: "Session sedang digunakan di device lain",
    fatal: true,
  },
  411: {
    reason: "Autentikasi gagal",
    action: "Perlu scan ulang QR/pairing",
    fatal: true,
  },
  428: {
    reason: "Rate limit",
    action: "Terlalu banyak request, tunggu beberapa menit",
    fatal: true,
  },
  440: {
    reason: "Login required",
    action: "Session expired, perlu login ulang",
    fatal: true,
  },
  500: {
    reason: "Server error WhatsApp",
    action: "Server WhatsApp bermasalah",
    fatal: false,
  },
  501: {
    reason: "Tidak diimplementasi",
    action: "Fitur belum didukung",
    fatal: true,
  },
  503: {
    reason: "Layanan tidak tersedia",
    action: "WhatsApp sedang maintenance",
    fatal: false,
  },
  515: {
    reason: "Stream error",
    action: "Akan mencoba reconnect",
    fatal: false,
  },
};

const CONNECTION_CLOSED_REASONS = [
  {
    match: /Connection Closed/i,
    reason: "Koneksi ditutup",
    action: "Kemungkinan nomor dibanned atau ada masalah jaringan",
    fatal: true,
  },
  {
    match: /write EOF/i,
    reason: "Koneksi terputus",
    action: "Masalah jaringan, akan mencoba reconnect",
    fatal: false,
  },
  {
    match: /ECONNRESET/i,
    reason: "Reset koneksi",
    action: "Jaringan tidak stabil",
    fatal: false,
  },
  {
    match: /ETIMEDOUT/i,
    reason: "Timeout",
    action: "Koneksi lambat",
    fatal: false,
  },
  {
    match: /logged out/i,
    reason: "Logged out",
    action: "Akun di-logout dari perangkat",
    fatal: true,
  },
  {
    match: /replaced/i,
    reason: "Session replaced",
    action: "Login di perangkat lain",
    fatal: true,
  },
  {
    match: /Multidevice mismatch/i,
    reason: "Session tidak valid",
    action: "Perlu scan ulang",
    fatal: true,
  },
  {
    match: /restart required/i,
    reason: "Restart diperlukan",
    action: "Akan restart otomatis",
    fatal: false,
  },
  {
    match: /bad session/i,
    reason: "Session rusak",
    action: "Perlu scan ulang",
    fatal: true,
  },
];

function parseDisconnectError(lastDisconnect) {
  const statusCode = lastDisconnect?.error?.output?.statusCode;
  const errorMessage = lastDisconnect?.error?.message || "Unknown error";

  if (statusCode && ERROR_MESSAGES[statusCode]) {
    return {
      ...ERROR_MESSAGES[statusCode],
      code: statusCode,
      message: errorMessage,
    };
  }

  for (const pattern of CONNECTION_CLOSED_REASONS) {
    if (pattern.match.test(errorMessage)) {
      return {
        code: statusCode || "N/A",
        reason: pattern.reason,
        action: pattern.action,
        fatal: pattern.fatal,
        message: errorMessage,
      };
    }
  }

  return {
    code: statusCode || "N/A",
    reason: "Error tidak dikenal",
    action: "Hubungi admin jika berulang",
    fatal: false,
    message: errorMessage,
  };
}

function isSocketAlive(sock) {
  try {
    if (!sock) return false;
    if (sock.ws && sock.ws.readyState === 1) return true;
    if (sock.user?.id) return true;
    return false;
  } catch {
    return false;
  }
}

async function safeSend(sock, jid, content, options = {}) {
  try {
    if (!jid) return null;
    if (!isSocketAlive(sock)) return null;
    return await sock.sendMessage(jid, content, options);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------------------------
// Resolusi nomor HP pengguna. Di grup (dan sebagian chat pribadi) WhatsApp memberi pengirim berupa LID
// ("1234567890@lid"), padahal pairing code harus diminta untuk NOMOR HP ("62812xxxx@s.whatsapp.net").
// Urutan: nomor ketikan user -> JID nomor yang sudah ada -> field alternatif di pesan -> pemetaan LID Baileys
// -> daftar anggota grup -> cache LID bot. Semua gagal -> pesan yang menjelaskan cara memberi nomor manual.
// ---------------------------------------------------------------------------------------------
const PN_SERVER = "@s.whatsapp.net";
const stripDevice = (j) => String(j || "").replace(/:\d+(?=@)/, "");
const isPnJid = (j) => typeof j === "string" && /^\d{5,16}(:\d+)?@s\.whatsapp\.net$/.test(j);
const isLidJid = (j) => typeof j === "string" && /@lid$/.test(j);

function manualNumberToJid(input) {
  let d = String(input || "").replace(/\D/g, "");
  if (!d) return null;
  if (d.startsWith("0")) d = "62" + d.slice(1); // 08xx -> 628xx (bawaan Indonesia)
  if (d.length < 8 || d.length > 15) return null;
  return d + PN_SERVER;
}

async function resolveUserJid(sock, m, jid, manualNumber) {
  if (manualNumber) {
    const manual = manualNumberToJid(manualNumber);
    if (!manual) throw new Error("Nomor tidak valid. Pakai kode negara tanpa +, contoh: .jadibot 628123456789");
    return manual;
  }

  const raw = stripDevice(jid || m?.sender);
  if (isPnJid(raw)) return raw;

  const lid = isLidJid(raw) ? raw : null;
  const key = m?.key || m?.fakeObj?.key || {};
  const msgKey = m?.fakeObj?.key || {};

  // 1) field alternatif yang disertakan Baileys pada pesan
  const alts = [
    key.participantPn, key.senderPn, key.participantAlt, key.remoteJidAlt, key.participant_pn,
    msgKey.participantPn, msgKey.senderPn, msgKey.participantAlt, msgKey.remoteJidAlt,
    m?.senderPn, m?.participantPn, m?.chatPn,
  ];
  for (const a of alts) {
    const c = stripDevice(a);
    if (isPnJid(c)) return c;
  }

  if (lid) {
    // 2) pemetaan LID -> nomor milik Baileys
    const lidNum = lid.split("@")[0];
    const mapping = sock?.signalRepository?.lidMapping || sock?.repository?.lidMapping;
    if (mapping?.getPNForLID) {
      for (const candidate of [lid, lidNum + ":0@lid", lidNum]) {
        try {
          const pn = stripDevice(await mapping.getPNForLID(candidate));
          if (isPnJid(pn)) return pn;
          if (/^\d{5,16}$/.test(pn)) return pn + PN_SERVER;
        } catch {}
      }
    }

    // 3) daftar anggota grup (peserta grup membawa phoneNumber / jid untuk tiap LID)
    const chat = m?.chat || key.remoteJid;
    if (typeof chat === "string" && chat.endsWith("@g.us") && typeof sock?.groupMetadata === "function") {
      try {
        const meta = await sock.groupMetadata(chat);
        for (const p of meta?.participants || []) {
          const ids = [p.id, p.lid, p.jid, p.phoneNumber].map(stripDevice);
          if (!ids.includes(lid)) continue;
          for (const c of ids) if (isPnJid(c)) return c;
        }
      } catch {}
    }

    // 4) cache LID milik bot (diisi dari pesan/anggota grup sebelumnya) dan kontak tersimpan
    try {
      const lidLib = require("./vanxone-lid.e4.js");
      const cached = lidLib.getCachedJid?.(lid);
      if (isPnJid(stripDevice(cached))) return stripDevice(cached);
      const viaSock = stripDevice(await lidLib.resolveFromSock?.(lid, sock));
      if (isPnJid(viaSock)) return viaSock;
    } catch {}
  }

  throw new Error(
    "Nomor WhatsApp kamu tidak terbaca otomatis (ID kamu berbentuk LID).\n" +
      "Ketik nomornya langsung, contoh: .jadibot 628123456789 (pakai kode negara, tanpa +)",
  );
}

async function startJadibot(sock, m, userJid, usePairing = true, manualNumber = "") {
  // sender di grup bisa berupa @lid -> cari nomor HP aslinya dulu (sebelumnya langsung error "Invalid User JID")
  userJid = await resolveUserJid(sock, m, userJid, manualNumber);
  userJid = stripDevice(userJid);
  if (!isPnJid(userJid)) throw new Error("Nomor WhatsApp tidak valid.");

  const id = userJid.replace(/@.+/g, "");

  if (usePairing) {
    const lastAttempt = rateLimit.get(id) || 0;
    if (Date.now() - lastAttempt < 60000) {
      throw new Error("Tunggu 1 menit sebelum mencoba lagi.");
    }
    rateLimit.set(id, Date.now());
  }

  const authPath = getJadibotAuthPath(userJid);

  if (jadibotSessions.has(id)) {
    throw new Error("Jadibot sudah aktif untuk nomor ini!");
  }

  if (!fs.existsSync(authPath)) {
    fs.mkdirSync(authPath, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(authPath);

  const {
    default: makeWASocket,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
  } = (() => { const B = require("@whiskeysockets/baileys"); return { default: typeof B.default === "function" ? B.default : B.makeWASocket, fetchLatestBaileysVersion: B.fetchLatestBaileysVersion, makeCacheableSignalKeyStore: B.makeCacheableSignalKeyStore }; })();
  const { version } = await fetchLatestBaileysVersion();
  const pinoModule = await import("pino");
  const pinoLogger = pinoModule.default({ level: "silent" });
  const childStore = createJadibotStore();
  const groupMetadataCache = new Map();

  const childSock = makeWASocket({
    version,
    logger: pinoLogger,
    printQRInTerminal: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pinoLogger),
    },
    browser: ["Ubuntu", "Chrome", "20.0.0"],
    syncFullHistory: false,
    generateHighQualityLinkPreview: false,
    markOnlineOnConnect: true,
    defaultQueryTimeoutMs: 20000,
    connectTimeoutMs: 20000,
    keepAliveIntervalMs: 10000,
    retryRequestDelayMs: 150,
    getMessage: async (key) => {
      return (await childStore.loadMessage(key.remoteJid, key.id))?.message;
    },
    cachedGroupMetadata: async (jid) => {
      const cached = groupMetadataCache.get(jid);
      if (cached) return cached;
      try {
        const fresh = await childSock.groupMetadata(jid);
        groupMetadataCache.set(jid, fresh);
        return fresh;
      } catch {
        return undefined;
      }
    },
    fireInitQueries: true,
    emitOwnEvents: true,
    shouldSyncHistoryMessage: () => false,
    transactionOpts: { maxCommitRetries: 5, delayBetweenTriesMs: 500 },
  });

  childStore.bind(childSock.ev);
  childSock.store = childStore;
  await extendSocket(childSock);

  let qrCount = 0;
  let lastQRMsg = null;
  let pairingCode = null;
  let heartbeatInterval = null;

  childSock.ev.on("creds.update", saveCreds);

  childSock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr && !usePairing) {
      qrCount++;
      if (qrCount > 3) {
        await safeSend(sock, m?.chat, {
          text: "❌ QR Code expired! Silakan coba lagi.",
        });
        if (lastQRMsg?.key) {
          await safeSend(sock, m?.chat, { delete: lastQRMsg.key });
        }
        jadibotSessions.delete(id);
        reconnectAttempts.delete(id);
        try {
          childSock.ws.close();
        } catch { }
        return;
      }

      try {
        const qrBuffer = await QRCode.toBuffer(qr, {
          scale: 8,
          margin: 4,
          width: 256,
          color: { dark: "#000000ff", light: "#ffffffff" },
        });

        if (lastQRMsg?.key) {
          await safeSend(sock, m?.chat, { delete: lastQRMsg.key });
        }

        if (!m?.chat) return;
        lastQRMsg = await sock.sendMessage(
          m.chat,
          {
            image: qrBuffer,
            caption:
              `🤖 *ᴊᴀᴅɪʙᴏᴛ — Qʀ ᴄᴏᴅᴇ*\n\n` +
              `Scan kode QR ini untuk menjadi bot.\n\n` +
              `> ⏱️ Expired dalam 20 detik\n` +
              `> 📊 QR Count: ${qrCount}/3`,
          },
          { quoted: m },
        );
      } catch (e) {
        logger.error("Jadibot", "Failed to send QR: " + e.message);
      }
    }

    if (connection === "open") {
      logger.info("Jadibot", `Connected: ${id}`);

      reconnectAttempts.delete(id);

      jadibotSessions.set(id, {
        sock: childSock,
        jid: childSock.user?.jid || userJid,
        startedAt: Date.now(),
        ownerJid: userJid,
        status: "connected",
        connectionReady: true,
        pendingMessages: [],
      });

      heartbeatInterval = setInterval(() => {
        try {
          if (!isSocketAlive(childSock)) {
            clearInterval(heartbeatInterval);
          }
        } catch { }
      }, 30000);

      const session = jadibotSessions.get(id);
      if (session) {
        session.heartbeatInterval = heartbeatInterval;
      }

      childSock.sendPresenceUpdate("available").catch(() => { });

      addJadibotOwner(id, userJid);

      if (m?.chat) {
        sock
          .sendMessage(m.chat, {
            text:
              `✅ *ᴊᴀᴅɪʙᴏᴛ ᴛᴇʀʜᴜʙᴜɴɢ*\n\n` +
              `> 📱 Nomor: *@${id}*\n` +
              `> 🟢 Status: *Online*\n` +
              `> ⏱️ Mulai: *${new Date().toLocaleTimeString("id-ID")}*\n\n` +
              `Bot kamu aktif dan siap menerima perintah!\n\n` +
              `> ℹ️ Ketik \`${m.prefix || "."}stopjadibot\` untuk menghentikan`,
            mentions: [userJid],
          })
          .catch((e) => {
            logger.error(
              "Jadibot",
              `Failed to send connected notification: ${e.message}`,
            );
          });
      }

      if (lastQRMsg?.key && m?.chat) {
        safeSend(sock, m.chat, { delete: lastQRMsg.key }).catch(() => { });
      }
    }

    if (connection === "close") {
      const errorInfo = parseDisconnectError(lastDisconnect);

      logger.info(
        "Jadibot",
        `Disconnected: ${id}, code: ${errorInfo.code}, reason: ${errorInfo.reason}`,
      );

      const session = jadibotSessions.get(id);
      if (session?.heartbeatInterval) {
        clearInterval(session.heartbeatInterval);
      }

      const attempts = reconnectAttempts.get(id) || 0;

      if (errorInfo.fatal || attempts >= MAX_RECONNECT_ATTEMPTS) {
        jadibotSessions.delete(id);
        reconnectAttempts.delete(id);

        if (errorInfo.fatal) {
          try {
            if (fs.existsSync(authPath)) {
              fs.rmSync(authPath, { recursive: true, force: true });
            }
          } catch { }
        }

        let statusEmoji = "❌";
        if (errorInfo.code === 403 || errorInfo.reason?.includes("banned")) {
          statusEmoji = "🚫";
        } else if (
          errorInfo.code === 406 ||
          errorInfo.reason?.includes("dibatasi")
        ) {
          statusEmoji = "⚠️";
        }

        await safeSend(sock, m?.chat, {
          text:
            `${statusEmoji} *ᴊᴀᴅɪʙᴏᴛ ᴅɪsᴄᴏɴɴᴇᴄᴛᴇᴅ*\n\n` +
            `> 📱 Nomor: *@${id}*\n` +
            `> 🔢 Code: \`${errorInfo.code}\`\n` +
            `> 📋 Alasan: *${errorInfo.reason}*\n` +
            `> ℹ️ ${errorInfo.action}\n\n` +
            (errorInfo.fatal
              ? `> ⚠️ Session dihapus. Gunakan \`.jadibot\` untuk memulai ulang.`
              : ""),
          mentions: [userJid],
        });
      } else {
        reconnectAttempts.set(id, attempts + 1);

        await safeSend(sock, m?.chat, {
          text:
            `🔄 *ᴊᴀᴅɪʙᴏᴛ ʀᴇᴄᴏɴɴᴇᴄᴛɪɴɢ...*\n\n` +
            `> 📱 Nomor: *@${id}*\n` +
            `> 📋 Alasan: *${errorInfo.reason}*\n` +
            `> 🔁 Percobaan: *${attempts + 1}/${MAX_RECONNECT_ATTEMPTS}*\n\n` +
            `> Reconnect dalam ${RECONNECT_INTERVAL / 1000} detik...`,
          mentions: [userJid],
        });

        setTimeout(() => {
          startJadibot(sock, m, userJid, false).catch((e) => {
            logger.error("Jadibot", `Reconnect failed for ${id}: ${e.message}`);
            jadibotSessions.delete(id);
            reconnectAttempts.delete(id);
          });
        }, RECONNECT_INTERVAL);
      }
    }
  });

  const processedMessages = new Map();

  childSock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (!childSock.user || !childSock.user.id) {
      childSock.user = {
        id: jidNormalizedUser(id),
        name: "Jadibot",
      };
    }

    if (type !== "notify" && type !== "append") return;

    for (const msg of messages) {
      if (!msg.message) continue;

      const msgId = msg.key?.id;
      if (msgId && processedMessages.has(msgId)) continue;
      if (msgId) processedMessages.set(msgId, Date.now());

      if (msg.key && msg.key.remoteJid === "status@broadcast") continue;

      const msgTimestamp = msg.messageTimestamp
        ? Number(msg.messageTimestamp) * 1000
        : Date.now();
      const msgAge = Date.now() - msgTimestamp;
      if (msgAge > 60 * 60 * 1000) continue;

      const metadataKeys = [
        "senderKeyDistributionMessage",
        "messageContextInfo",
      ];
      const msgType =
        Object.keys(msg.message).find((k) => !metadataKeys.includes(k)) ||
        Object.keys(msg.message)[0];
      const ignoredTypes = [
        "protocolMessage",
        "senderKeyDistributionMessage",
        "reactionMessage",
        "stickerSyncRmrMessage",
        "encReactionMessage",
        "pollUpdateMessage",
        "pollCreationMessage",
        "pollCreationMessageV2",
        "pollCreationMessageV3",
        "keepInChatMessage",
        "deviceSentMessage",
        "call",
        "peerDataOperationRequestMessage",
      ];
      if (ignoredTypes.includes(msgType)) continue;

      if (!isSocketAlive(childSock)) continue;

      const session = jadibotSessions.get(id);
      if (session && !session.connectionReady) {
        session.pendingMessages = session.pendingMessages || [];
        session.pendingMessages.push(msg);
        continue;
      }

      try {
        // pesan jadibot diproses oleh pemroses pesan utama WhatsApp Bot (semua fitur, UI, survival, hook ikut jalan)
        if (typeof global.__vxHandleUpsert !== "function") throw new Error("pemroses pesan utama belum siap");
        await global.__vxHandleUpsert(childSock, { messages: [msg], type: "notify" });
      } catch (e) {
        if (
          e.message?.includes("Connection Closed") ||
          e.message?.includes("428")
        ) {
          logger.info(
            "Jadibot",
            `${id} connection closed during handler, skipping`,
          );
          break;
        }
        logger.error("Jadibot", `Handler error for ${id}: ${e.message}`);
      }
    }

    const fiveMinAgo = Date.now() - 300000;
    for (const [key, time] of processedMessages) {
      if (time < fiveMinAgo) processedMessages.delete(key);
    }
  });

  if (usePairing && !state.creds?.registered) {
    try {
      await delay(3000);
      pairingCode = await childSock.requestPairingCode(id);
      pairingCode = pairingCode.match(/.{1,4}/g)?.join("-") || pairingCode;

      if (m && m.chat) {
        let thumbnail = null;
        try {
          if (!!getAssetBuffer("vanxone2")) {
            thumbnail = getAssetBuffer("vanxone2");
          }
        } catch { }

        await sock.sendMessage(
          m.chat,
          {
            text:
              `🔗 *ᴘᴀɪʀɪɴɢ ᴄᴏᴅᴇ*\n\n` +
              `Masukkan kode berikut di WhatsApp kamu:\n\n` +
              `> 📱 *Settings → Linked Devices → Link a Device*\n\n` +
              `\`\`\`${pairingCode}\`\`\`\n\n` +
              `> 🕕 Kode berlaku beberapa menit\n` +
              `> ⚠️ Jangan bagikan kode ini ke siapapun`,
            contextInfo: saluranCtx(),
            interactiveButtons: [
              {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: "📋 Copy Pairing Code",
                  copy_code: pairingCode.replace(/-/g, ""),
                }),
              },
            ],
          },
          { quoted: m },
        );
      } else {
        logger.info("Jadibot", `Pairing Code for ${id}: ${pairingCode}`);
      }
    } catch (e) {
      logger.error("Jadibot", "Failed to get pairing code: " + e.message);

      let errorMsg = "Gagal mendapatkan pairing code";
      if (
        e.message?.includes("rate") ||
        e.message?.includes("limit") ||
        e.message?.includes("428")
      ) {
        errorMsg = "Rate limited! Tunggu 5-10 menit.";
      } else if (
        e.message?.includes("banned") ||
        e.message?.includes("blocked")
      ) {
        errorMsg = "Nomor mungkin dibanned WhatsApp.";
      } else if (
        e.message?.includes("Connection Closed") ||
        e.message?.includes("closed")
      ) {
        errorMsg = "Koneksi terputus. Coba lagi.";
      }

      await safeSend(sock, m?.chat, {
        text: `❌ *ᴊᴀᴅɪʙᴏᴛ ɢᴀɢᴀʟ*\n\n> ${errorMsg}`,
      });

      try {
        childSock.end?.();
      } catch { }
      jadibotSessions.delete(id);
      reconnectAttempts.delete(id);
      throw new Error(errorMsg);
    }
  }

  return { sock: childSock, pairingCode };
}

async function stopJadibot(jid, deleteSession = false) {
  const id = jid.replace(/@.+/g, "");
  const session = jadibotSessions.get(id);

  if (session) {
    try {
      if (session.heartbeatInterval) {
        clearInterval(session.heartbeatInterval);
      }
      session.sock.ev.removeAllListeners();
      session.sock.ws.close();
    } catch { }
    jadibotSessions.delete(id);
  }

  reconnectAttempts.delete(id);

  if (deleteSession) {
    const authPath = getJadibotAuthPath(jid);
    if (fs.existsSync(authPath)) {
      fs.rmSync(authPath, { recursive: true, force: true });
    }
  }

  return true;
}

async function stopAllJadibots() {
  const stopped = [];
  for (const [id, session] of jadibotSessions) {
    try {
      if (session.heartbeatInterval) {
        clearInterval(session.heartbeatInterval);
      }
      session.sock.ev.removeAllListeners();
      session.sock.ws.close();
    } catch { }
    stopped.push(id);
  }
  jadibotSessions.clear();
  reconnectAttempts.clear();
  return stopped;
}

async function restartJadibotSession(sock, sessionId) {
  const userJid = sessionId + "@s.whatsapp.net";
  try {
    logger.info("Jadibot", `Restoring session: ${sessionId}`);

    const dbPath = path.join(JADIBOT_AUTH_FOLDER, sessionId, "data.json");
    let ownerJid = userJid;
    try {
      if (fs.existsSync(dbPath)) {
        const data = JSON.parse(fs.readFileSync(dbPath, "utf8"));
        if (data.owners?.[0]) ownerJid = data.owners[0] + "@s.whatsapp.net";
      }
    } catch { }

    const mockM = {
      chat: ownerJid,
      sender: ownerJid,
      prefix: ".",
      key: {
        remoteJid: ownerJid,
        fromMe: false,
        id: "restart-" + Date.now(),
      },
      reply: async (text) => {
        await safeSend(sock, ownerJid, { text });
      },
      react: async () => { },
    };
    await startJadibot(sock, mockM, userJid, false);
  } catch (e) {
    logger.error("Jadibot", `Failed to restore ${sessionId}: ${e.message}`);
  }
}

function getJadibotStatus(jid) {
  const id = jid.replace(/@.+/g, "");
  const session = jadibotSessions.get(id);
  if (!session) return null;

  return {
    id,
    jid: session.jid,
    status: session.status || "unknown",
    startedAt: session.startedAt,
    ownerJid: session.ownerJid,
    uptime: Date.now() - session.startedAt,
  };
}



Object.defineProperty(__vxExports, "JADIBOT_AUTH_FOLDER", { enumerable: true, get: () => JADIBOT_AUTH_FOLDER });
Object.defineProperty(__vxExports, "jadibotSessions", { enumerable: true, get: () => jadibotSessions });
Object.defineProperty(__vxExports, "getJadibotAuthPath", { enumerable: true, get: () => getJadibotAuthPath });
Object.defineProperty(__vxExports, "isJadibotActive", { enumerable: true, get: () => isJadibotActive });
Object.defineProperty(__vxExports, "getActiveJadibots", { enumerable: true, get: () => getActiveJadibots });
Object.defineProperty(__vxExports, "getAllJadibotSessions", { enumerable: true, get: () => getAllJadibotSessions });
Object.defineProperty(__vxExports, "resolveUserJid", { enumerable: true, get: () => resolveUserJid });
Object.defineProperty(__vxExports, "manualNumberToJid", { enumerable: true, get: () => manualNumberToJid });
Object.defineProperty(__vxExports, "startJadibot", { enumerable: true, get: () => startJadibot });
Object.defineProperty(__vxExports, "stopJadibot", { enumerable: true, get: () => stopJadibot });
Object.defineProperty(__vxExports, "stopAllJadibots", { enumerable: true, get: () => stopAllJadibots });
Object.defineProperty(__vxExports, "restartJadibotSession", { enumerable: true, get: () => restartJadibotSession });
Object.defineProperty(__vxExports, "getJadibotStatus", { enumerable: true, get: () => getJadibotStatus });
Object.defineProperty(__vxExports, "isSocketAlive", { enumerable: true, get: () => isSocketAlive });
Object.defineProperty(__vxExports, "safeSend", { enumerable: true, get: () => safeSend });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));

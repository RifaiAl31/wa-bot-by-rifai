'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
const __vxExports = {};
const chalk = __vxDef(require("chalk"));
const timeHelper = __vxNs(require("./vanxone-time.js"));
const { getCachedJid, isLidConverted } = require("./vanxone-lid.e4.js");

// Mock gradient-string if any other file imports it from here
const gradientMock = (text) => text;
const gradient = () => gradientMock;

// 3 Main Colors
const cGreen = chalk.greenBright;
const cWhite = chalk.whiteBright;
const cGray = chalk.gray;

// Helper to create linux-style brackets
function makeTag(label, isSuccess = false, isError = false) {
  const text = label.toUpperCase().substring(0, 4).padStart(4, " ");
  if (isSuccess) return `${cGray("[")} ${cGreen(text)} ${cGray("]")}`;
  if (isError) return `${cGray("[")} ${cWhite(text)} ${cGray("]")}`; // Error uses white inside brackets for visibility, or green? User said green for check/highlights, white for important text. Let's use White for error labels or Gray.
  return `${cGray("[")} ${cWhite(text)} ${cGray("]")}`;
}

const SYM = {
  ok: makeTag("OK", true),
  no: makeTag("FAIL", false, true),
  wn: makeTag("WARN"),
  info: makeTag("INFO"),
  sys: makeTag("SYS"),
  dbg: makeTag("DBG"),
};

function writeLog(kind, label, detail = "") {
  const tags = {
    info: SYM.info,
    success: SYM.ok,
    warn: SYM.wn,
    error: SYM.no,
    system: SYM.sys,
    debug: SYM.dbg,
  };
  const tag = tags[kind] || SYM.info;

  // Format: [  OK  ] Started WhatsApp Bot
  const msg = `${tag} ${cWhite(label)}${detail ? " " + cGray(detail) : ""}`;
  console.log(msg);
}

const logger = {
  info: (label, detail = "") => writeLog("info", label, detail),
  success: (label, detail = "") => writeLog("success", label, detail),
  warn: (label, detail = "") => writeLog("warn", label, detail),
  error: (label, detail = "") => writeLog("error", label, detail),
  system: (label, detail = "") => writeLog("system", label, detail),
  debug: (label, detail = "") => writeLog("debug", label, detail),
  tag: (label, msg, detail = "") => {
    console.log(`${makeTag(label.substring(0, 4))} ${cWhite(msg)}${detail ? " " + cGray(detail) : ""}`);
  },
};

function createSpinner(label = "SYS", text = "loading", options = {}) {
  // Simplified spinner for linux style (just log the start)
  let active = false;
  return {
    start() {
      active = true;
      console.log(`${makeTag(label)} ${cWhite(text)}...`);
    },
    update(nextText) {
      if (active) console.log(`${makeTag(label)} ${cWhite(nextText)}...`);
    },
    stop() {
      active = false;
    },
    succeed(detail = text) {
      this.stop();
      logger.success(label, detail);
    },
    warn(detail = text) {
      this.stop();
      logger.warn(label, detail);
    },
    fail(detail = text) {
      this.stop();
      logger.error(label, detail);
    },
    isActive() {
      return active;
    }
  };
}

async function spinText(label, text, options = {}) {
  // Directly print success since we want a fast, simple boot
  console.log(`${makeTag("OK", true)} ${cWhite(text)}`);
}

async function typeLine(text, options = {}) {
  // Strip formatting from caller if it used old colors
  const clean = text.replace(/\x1B\[\d+m/g, "");
  console.log(`${makeTag("OK", true)} ${cWhite(clean)}`);
}

async function runLoader(text = "memuat", options = {}) {
  console.log(`${makeTag("OK", true)} ${cWhite(text)}`);
}

async function playBootSequence(info = {}) {
  const { name = "WhatsApp Bot", version = "1.0.0", mode = "public" } = info;
  console.log("");
  console.log(`${cGray("---")}`);
  console.log(`${makeTag("BOOT", true)} ${cWhite(`Starting ${name} v${version}`)}`);
  console.log(`${makeTag("INFO")} ${cGray(`Mode: ${mode}`)}`);
}

function getTypeTag(msgType, isNewsletter) {
  if (isNewsletter) return "Channel";

  const map = {
    imageMessage: "Image",
    videoMessage: "Video",
    audioMessage: "Audio",
    stickerMessage: "Sticker",
    documentMessage: "Doc",
    contactMessage: "Contact",
    locationMessage: "Location",
    viewOnceMessageV2: "1xView",
    extendedTextMessage: "Text",
    conversation: "Text",
    interactiveResponseMessage: "Button",
    pollCreationMessage: "Poll",
    reactionMessage: "Reaction",
  };
  return map[msgType] || "Message";
}

function logMessage(info) {
  if (!info || typeof info !== "object") return;

  const {
    chatType = "private",
    groupName = "",
    pushName = "",
    sender = "",
    message = "",
    messageType = "conversation",
    isNewsletter = false,
  } = info;
  if (!sender) return;

  const clean = (value, max = 500) => String(value ?? "")
    .replace(/\u001b\[[0-?]*[ -/]*[@-~]/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[\r\n\t]+/g, " ")
    .trim()
    .slice(0, max);

  const senderId = String(sender).split(":")[0];
  const num = senderId.replace(/@.+$/, "").replace(/[^0-9]/g, "") || "Tidak tersedia";
  const senderName = clean(pushName, 60) || num;
  const typeTag = getTypeTag(messageType, isNewsletter || chatType === "newsletter");
  const isGroup = chatType === "group";
  const chatLabel = isNewsletter || chatType === "newsletter"
    ? "Saluran"
    : isGroup
      ? `Grup: ${clean(groupName || "Grup WhatsApp", 60)}`
      : "Chat Pribadi";
  const text = clean(message, 500) || `[${typeTag.toUpperCase()} tanpa teks]`;
  const time = timeHelper.formatTime("HH:mm:ss");
  const date = timeHelper.formatTime("DD/MM/YYYY");

  // WhatsApp Bot terminal theme: calm cyan/blue, readable white, subdued borders.
  const edge = chalk.blueBright;
  const label = chalk.cyanBright;
  console.log("");
  console.log(` ${edge("╭━━〔")} ${chalk.whiteBright.bold("WhatsApp Bot")} ${label("PESAN MASUK")} ${edge("〕━━")}`);
  console.log(` ${edge("┃")} ${label("Nama   :")} ${chalk.whiteBright(senderName)}`);
  console.log(` ${edge("┃")} ${label("Chat   :")} ${chalk.whiteBright(chatLabel)}`);
  console.log(` ${edge("┃")} ${label("Nomor  :")} ${chalk.whiteBright(num === "Tidak tersedia" ? num : "+" + num)}`);
  console.log(` ${edge("┃")} ${label("Waktu  :")} ${chalk.gray(`${date} ${time}`)}`);
  console.log(` ${edge("┃")} ${label("Tipe   :")} ${chalk.greenBright(typeTag)}`);
  console.log(` ${edge("┃")} ${label("Pesan  :")} ${chalk.whiteBright(text)}`);
  console.log(` ${edge("╰──────────────────────────────────────╯")}`);
}

function logPlugin(name, category) {
  // Simple tree view for plugin
  console.log(`  ${cGray("├─")} ${cWhite(name)} ${cGray(`[${category}]`)}`);
}

function logConnection(status, info = "") {
  if (status === "connected") {
    console.log(`${makeTag("OK", true)} ${cWhite("Connected")} ${cGray(info ? `— ${info}` : "")}`);
  } else if (status === "connecting") {
    console.log(`${makeTag("WAIT")} ${cWhite("Connecting")} ${cGray(info ? `— ${info}` : "")}`);
  } else {
    console.log(`${makeTag("FAIL", false, true)} ${cWhite("Disconnected")} ${cGray(info ? `— ${info}` : "")}`);
  }
}

function logErrorBox(title, message) {
  console.log(`${makeTag("ERR", false, true)} ${cWhite(title)}: ${cGray(message)}`);
}

function printBanner(mini = false) {
  // No banner for linux style
}

function printStartup(info = {}) {
  // Already handled by boot sequence
}

const CODES = {
  reset: "", bold: "", dim: "", italic: "", underline: "",
  green: "", purple: "", white: "", gray: "", phantom: "",
  lime: "", silver: "", red: "", yellow: "", blue: "",
  cyan: "", magenta: "", bgBlack: "", bgGray: "",
};

// Map all colors to our 3 colors
const c = {
  green: cGreen,
  purple: cWhite,
  white: cWhite,
  gray: cGray,
  bold: (v) => v,
  dim: cGray,
  greenBold: cGreen,
  purpleBold: cWhite,
  whiteBold: cWhite,
  grayDim: cGray,
  red: cWhite,
  yellow: cWhite,
  cyan: cWhite,
  blue: cWhite,
  magenta: cWhite,
};

function divider() {
  // No divider for minimalism, or just a new line
  console.log("");
}

function createBanner(lines, color = "green") {
  return lines.map(l => `${cGray("│")} ${cWhite(l)}`).join("\n");
}

function getTimestamp() {
  return cGray(timeHelper.formatTime("HH:mm:ss"));
}

const theme = {
  primary: cWhite,
  secondary: cWhite,
  accent: cGreen,
  text: cWhite,
  dim: cGray,
  muted: cGray,
  success: cGreen,
  error: cWhite,
  warning: cWhite,
  info: cWhite,
  debug: cGray,
  border: cGray,
  tag: cWhite,
  pill: (t) => t,
  rainbow: gradientMock,
  borderFx: (t) => cGray(t),
  mintFx: (t) => cGreen(t),
  warmFx: (t) => cWhite(t),
  colorizeCategory: (t) => cWhite(t),
};



Object.defineProperty(__vxExports, "c", { enumerable: true, get: () => c });
Object.defineProperty(__vxExports, "CODES", { enumerable: true, get: () => CODES });
Object.defineProperty(__vxExports, "logger", { enumerable: true, get: () => logger });
Object.defineProperty(__vxExports, "createSpinner", { enumerable: true, get: () => createSpinner });
Object.defineProperty(__vxExports, "spinText", { enumerable: true, get: () => spinText });
Object.defineProperty(__vxExports, "typeLine", { enumerable: true, get: () => typeLine });
Object.defineProperty(__vxExports, "runLoader", { enumerable: true, get: () => runLoader });
Object.defineProperty(__vxExports, "playBootSequence", { enumerable: true, get: () => playBootSequence });
Object.defineProperty(__vxExports, "logMessage", { enumerable: true, get: () => logMessage });
Object.defineProperty(__vxExports, "logPlugin", { enumerable: true, get: () => logPlugin });
Object.defineProperty(__vxExports, "logConnection", { enumerable: true, get: () => logConnection });
Object.defineProperty(__vxExports, "logErrorBox", { enumerable: true, get: () => logErrorBox });
Object.defineProperty(__vxExports, "printBanner", { enumerable: true, get: () => printBanner });
Object.defineProperty(__vxExports, "printStartup", { enumerable: true, get: () => printStartup });
Object.defineProperty(__vxExports, "createBanner", { enumerable: true, get: () => createBanner });
Object.defineProperty(__vxExports, "getTimestamp", { enumerable: true, get: () => getTimestamp });
Object.defineProperty(__vxExports, "divider", { enumerable: true, get: () => divider });
Object.defineProperty(__vxExports, "theme", { enumerable: true, get: () => theme });
Object.defineProperty(__vxExports, "chalk", { enumerable: true, get: () => chalk });
Object.defineProperty(__vxExports, "gradient", { enumerable: true, get: () => gradient });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));

'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxExports = {};
// Compatibility bridge: fitur port WhatsApp Bot wajib berjalan di atas core WhatsApp Bot.
const { getDatabase } = require("./vanxone-database.e4.js");
const { "f": httpRequest } = require("./vanxone-http.js");
const { fetchJson, randomInt, md5 } = require("./vanxone-utils.e7.js");
const { sendText } = require("./vanxone-message.js");
const { vanxoneApiManager } = require("./vanxone-apimanager.e7.js");
const config = __vxDef(require("../../config.e7.js"));



async function riooJson(url, options = {}) {
  const { method = "GET", headers = {}, body = null, timeout } = options;
  if (timeout) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
        signal: controller.signal,
      });
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }
  return fetchJson(url, options.fetchOptions || {});
}

Object.defineProperty(__vxExports, "getDatabase", { enumerable: true, get: () => getDatabase });
Object.defineProperty(__vxExports, "httpRequest", { enumerable: true, get: () => httpRequest });
Object.defineProperty(__vxExports, "fetchJson", { enumerable: true, get: () => fetchJson });
Object.defineProperty(__vxExports, "randomInt", { enumerable: true, get: () => randomInt });
Object.defineProperty(__vxExports, "md5", { enumerable: true, get: () => md5 });
Object.defineProperty(__vxExports, "sendText", { enumerable: true, get: () => sendText });
Object.defineProperty(__vxExports, "vanxoneApiManager", { enumerable: true, get: () => vanxoneApiManager });
Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => config });
Object.defineProperty(__vxExports, "riooJson", { enumerable: true, get: () => riooJson });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));

// owner/disableplugin — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/disableplugin.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "disableplugin",
  "command": [
    "disableplugin",
    "dplugin",
    "plugindisable",
    "offplugin"
  ],
  "category": "owner",
  "desc": "Menonaktifkan plugin tertentu",
  "usage": ".disableplugin <nama_plugin>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/disableplugin", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/disableplugin.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
    name: "disableplugin",
    alias: ["dplugin", "plugindisable", "offplugin"],
    category: "owner",
    description: "Menonaktifkan plugin tertentu",
    usage: ".disableplugin <nama_plugin>",
    example: ".disableplugin sticker",
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true,
  };
  
  async function findPluginFile(pluginName) {
    const pluginsDir = path.join(process.cwd(), "plugins");
    const categories = fs.readdirSync(pluginsDir).filter((f) => {
      return fs.statSync(path.join(pluginsDir, f)).isDirectory();
    });
  
    for (const category of categories) {
      const categoryPath = path.join(pluginsDir, category);
      const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith(".js"));
  
      for (const file of files) {
        try {
          const filePath = path.join(categoryPath, file);
          const plugin = await import(`file://${filePath.replace(/\\/g, "/")}`);
  
          if (!plugin.config) continue;
  
          const name = Array.isArray(plugin.config.name)
            ? plugin.config.name[0]
            : plugin.config.name;
  
          const aliases = plugin.config.alias || [];
  
          if (name === pluginName || aliases.includes(pluginName)) {
            return { filePath, plugin, category, file };
          }
        } catch {}
      }
    }
  
    return null;
  }
  
  async function handler(m, { sock }) {
    const args = m.args || [];
    const pluginName = args[0]?.toLowerCase();
  
    if (!pluginName) {
      return m.reply(
        `🔌 *ᴅɪsᴀʙʟᴇ ᴘʟᴜɢɪɴ*\n\n` +
          `> Masukkan nama plugin yang ingin dinonaktifkan\n\n` +
          `*Contoh:*\n` +
          `> \`${m.prefix}disableplugin sticker\`\n` +
          `> \`${m.prefix}disableplugin tiktok\``,
      );
    }
  
    const found = await findPluginFile(pluginName);
  
    if (!found) {
      return m.reply(`❌ Plugin *${pluginName}* tidak ditemukan!`);
    }
  
    const { filePath, plugin, category, file } = found;
  
    if (plugin.config.isEnabled === false) {
      return m.reply(`⚠️ Plugin *${pluginName}* sudah dinonaktifkan!`);
    }
  
    try {
      let content = fs.readFileSync(filePath, "utf-8");
  
      content = content.replace(/isEnabled:\s*true/i, "isEnabled: false");
  
      fs.writeFileSync(filePath, content);
  
      await m.reply(
        `✅ *ᴘʟᴜɢɪɴ ᴅɪsᴀʙʟᴇᴅ*\n\n` +
          `╭┈┈⬡「 📋 *ᴅᴇᴛᴀɪʟ* 」\n` +
          `┃ 📦 Plugin: *${plugin.config.name}*\n` +
          `┃ 📁 Category: *${category}*\n` +
          `┃ 📄 File: *${file}*\n` +
          `┃ 🔴 Status: *Disabled*\n` +
          `╰┈┈⬡\n\n` +
          `> Restart bot atau gunakan hot reload untuk apply.`,
      );
    } catch (error) {
      await m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})

// tools/a2uidemo — satu file: metadata + kode fitur (gabungan dari engine8/plugins/tools/a2uidemo.js)
const __vx = require("../../lib/adapter/e8.js")
const __meta = {
  "name": "a2uidemo",
  "command": [
    "a2uidemo",
    "uidemo",
    "a2ui-demo"
  ],
  "category": "tools",
  "desc": "Demo widget interaktif A2UI (card, checkbox, form, button)",
  "usage": ".a2uidemo\n.a2uidemo simple",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/a2uidemo", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/a2uidemo.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { A2UI, sendA2UIWidget } = require("../../lib/ext/src/lib/vanxone-ui.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e8.js"));
  
  const pluginConfig = {
    name: "a2uidemo",
    alias: ["uidemo", "a2ui-demo"],
    category: "tools",
    description: "Demo widget interaktif A2UI (card, checkbox, form, button)",
    usage: ".a2uidemo\n.a2uidemo simple",
    example: ".a2uidemo",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true,
  };
  
  async function sendSimpleDemo(sock, chat) {
    const ui = new A2UI();
    ui.root([ui.card(ui.column([ui.text("Ini A2UI By WhatsApp Bot", { variant: "caption" })]))]);
  
    await sendA2UIWidget(sock, chat, { a2ui: ui });
  }
  
  async function sendFullDemo(sock, chat) {
    const ui = new A2UI();
  
    const img = ui.image(
      "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png",
      { variant: "header" }
    );
    const title = ui.text("Ini Title", { variant: "h1" });
    const description = ui.text("Ini Description");
    const status = ui.text("Ini Caption", { variant: "caption" });
  
    const profileCard = ui.card(ui.column([img, description, status]));
  
    const sectionTitle = ui.text("Ini Section Title", { variant: "h2" });
    const option1 = ui.checkbox("Ini Checkbox 1");
    const option2 = ui.checkbox("Ini Checkbox 2");
    const option3 = ui.checkbox("Ini Checkbox 3");
    const section = ui.column([sectionTitle, option1, option2, option3]);
  
    const inputTitle = ui.text("Ini Input Section", { variant: "h2" });
    const input = ui.textField("Ini Placeholder", { variant: "longText" });
    const buttonText = ui.text("Ini Button");
    const button = ui.button(buttonText, { action: { name: "testAction" } });
    const form = ui.column([inputTitle, input, button]);
  
    ui.root([title, profileCard, section, form]);
  
    await sendA2UIWidget(sock, chat, {
      footer: "• Ini Footer",
      buttons: [
        {
          name: "cta_url",
          params: {
            display_text: "Ini Button 1",
            url: "https://www.google.com",
            merchant_url: "https://www.google.com",
          },
        },
        {
          name: "cta_url",
          params: {
            display_text: "Ini Button 2",
            url: "https://www.google.com",
            merchant_url: "https://www.google.com",
          },
        },
      ],
      a2ui: ui,
      contextInfo: { expiration: 7776000 },
    });
  }
  
  async function handler(m, { sock }) {
    const mode = (m.args[0] || "").toLowerCase();
  
    await m.react("🕕");
    try {
      if (mode === "simple") {
        await sendSimpleDemo(sock, m.chat);
      } else {
        await sendFullDemo(sock, m.chat);
      }
      await m.react("✅");
    } catch (e) {
      console.error(e);
      await m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})

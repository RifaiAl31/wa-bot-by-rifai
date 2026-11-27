// ai/copilot — satu file: metadata + kode fitur (gabungan dari engine7/plugins/ai/copilot.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "copilot",
  "command": [
    "copilot"
  ],
  "category": "ai",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/copilot", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/copilot.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  /*• Nama Fitur : copilot 3 model
  • Type : Plugin ESM
  • Link Channel : 
  • Author : WhatsApp Bot
  */
  const pluginConfig = {
    name: "copilot",
    alias: [],
    category: "ai",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock, text, prefix, command }) {
      const conn = sock;
      const usedPrefix = prefix || m.prefix || ".";
    if (!text) {
      throw `Please provide a message.\n\nExample: ${usedPrefix + command} Hello, what is a black hole?`;
    }
  
    try {
      await m.reply('Thinking...');
  
      const models = ['default', 'gpt-5', 'think-deeper'];
      const randomModel = models[Math.floor(Math.random() * models.length)];
      
      const apiUrl = `https://theresapis.vercel.app/ai/copilot?message=${encodeURIComponent(text)}&model=${randomModel}`;
      
      const response = await fetch(apiUrl);
      const json = await response.json();
  
      if (json.status && json.result && json.result.text) {
        const resultText = json.result.text;
        await m.reply(`${resultText}\n\n*(Model: ${randomModel})*`);
      } else {
        throw new Error('Invalid API response format or failed request.');
      }
    } catch (error) {
      console.error(error);
      m.reply('Sorry, an error occurred while processing your request. Please try again later.');
    }
  };
  
  handler.description = 'Chat with an AI using a randomly selected model (default, gpt-5, think-deeper).';
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})

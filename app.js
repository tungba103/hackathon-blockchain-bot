// Config các biến môi trường
require('dotenv').config();
// const ChatGPTService = require('./services/chatgpt.service');
const DbService = require('./services/db.service');
const TelegramService = require('./services/telegram.service');

DbService.connect().then(() => {
  const bot = TelegramService.register(true);
  bot.on('message', async (msg) => TelegramService.responseToMessage(msg));
});

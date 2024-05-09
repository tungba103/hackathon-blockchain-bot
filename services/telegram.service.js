const TelegramBot = require('node-telegram-bot-api');
const DbService = require('./db.service');
// const ChatGPTService = require('./chatgpt.service');

class TelegramService {
  bot;
  constructor() {}
  register(polling = false) {
    const telegramToken = process.env.TELEGRAM_KEY;
    this.bot = new TelegramBot(telegramToken, { polling });
    return this.bot;
  }
  async responseToMessage(msg) {
    const bot = this.bot;
    const authorId = msg.from.id;
    const chatId = msg.chat.id;
    const chatMsg = msg.text;

    const user = await DbService.getUserByTelegramId(authorId);

    const timer = new Date().getTime();
    try {
      // const responseMsg = await ChatGPTService.generateCompletion(chatMsg, user);

      await DbService.createNewAddress(user, chatMsg, chatMsg);

      const listAddresses = await DbService.getUserAddresses(user);

      const responseMsg = 'Hello, This is your addresses: ' + listAddresses.map((addr) => addr.aliasName).join(', ');
      const timeDiff = new Date().getTime() - timer;
      console.log('Taken ' + timeDiff + 'ms to respond (about ' + ~~(timeDiff / 100) / 10 + 's)');
      return await bot.sendMessage(chatId, responseMsg);
    } catch (e) {
      if (e && e.response && e.response.data) {
        await bot.sendMessage(chatId, e.response.data?.error?.message || 'Failed status from OpenAI Platform');
        console.log(e.response.data?.error);
      } else {
        await bot.sendMessage(chatId, 'Unexpected error, please check server log for more details.');
      }
    }
  }
}

const telegramService = new TelegramService();

module.exports = telegramService;

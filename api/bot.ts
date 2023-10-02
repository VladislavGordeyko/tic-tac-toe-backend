// https://github.com/yagop/node-telegram-bot-api/issues/319#issuecomment-324963294
// import TelegramBot from 'node-telegram-bot-api';
// import { botOptions, env } from "../config";
// import { handleHello, handleMessage, handleStart } from '../src/telegram/handlers';

// // Fixes an error with Promise cancellation
// const { TOKEN } = env;
// // Require our Telegram helper package

// const bot = new TelegramBot(TOKEN, botOptions);


// export default async function handle(req: any, res: any) {
// 	try {
// 		bot.onText(/\/start/, handleStart(bot));
//     bot.onText(/\/hello/, handleHello(bot));
//     bot.on('message', handleMessage(bot));

// 	} catch (e: any) {
// 		res.statusCode = 500;
// 		res.setHeader("Content-Type", "text/html");
// 		res.end("<h1>Server Error</h1><p>Sorry, there was a problem</p>");
// 		console.error(e.message);
// 	}
// }

import { VercelRequest, VercelResponse } from '@vercel/node';
import { env } from "../config";

const TelegramBot = require('node-telegram-bot-api');
const { TOKEN } = env;
const bot = new TelegramBot(TOKEN);

bot.on('message', (msg: any) => {
	const chatId = msg.chat.id;
	bot.sendMessage(chatId, 'Hello from bot!');
  });

module.exports = (req: VercelRequest, res: VercelResponse) => {
  const body = req.body;
  bot.processUpdate(body);
  res.status(200).send('Event received');
};

import { VercelRequest, VercelResponse } from '@vercel/node';
import { env } from "../../config";
const TelegramBot = require('node-telegram-bot-api');
// https://github.com/yagop/node-telegram-bot-api/issues/319#issuecomment-324963294
// import TelegramBot from 'node-telegram-bot-api';
// import { botOptions, env } from "../config";
// import { handleHello, handleMessage, handleStart } from '../src/telegram/handlers';

// // Fixes an error with Promise cancellation
// const { TOKEN } = env;
// // Require our Telegram helper package

// const bot = new TelegramBot(TOKEN, botOptions);


export default async function handle(req: VercelRequest, res: VercelResponse) {

    const { TOKEN, WEBHOOK } = env;
    const bot = new TelegramBot(TOKEN);
        try {

            bot.on('message', (msg: any) => {
                	const chatId = msg.chat.id;
                	bot.sendMessage(chatId, 'Hello from bot!');
                  });
            // bot.onText(/\/start/, handleStart(bot));
            // bot.onText(/\/hello/, handleHello(bot));
            // bot.on('message', handleMessage(bot));

        } catch (e: any) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "text/html");
            res.end("<h1>Server Error</h1><p>Sorry, there was a problem</p>");
            console.error(e.message);
        }
}






// bot.setWebHook(`${WEBHOOK}/bot${TOKEN}`);

// // app.post(`/bot${TOKEN}`, (req, res) => {
// //     bot.processUpdate(req.body);
// //     res.sendStatus(200);
// //   });

// bot.on('message', (msg: any) => {
// 	const chatId = msg.chat.id;
// 	bot.sendMessage(chatId, 'Hello from bot!');
//   });

// module.exports = (req: VercelRequest, res: VercelResponse) => {
//   const body = req.body;
//   bot.processUpdate(body);
//   res.status(200).send('Event received');
// };


// // https://github.com/yagop/node-telegram-bot-api/issues/319#issuecomment-324963294
// // Fixes an error with Promise cancellation

// // Require our Telegram helper package
// const TelegramBot = require('node-telegram-bot-api');

// module.exports = async (request: VercelRequest, response: VercelResponse) => {
//     try {
//               const bot = new TelegramBot(TOKEN);

//             const { body } = request;

//         // Ensure that this is a message being sent
//         if (body.message) {
//             // Retrieve the ID for this chat
//             // and the text that the user sent
//             const { chat: { id }, text } = body.message;

//             // Create a message to send back
//             // We can use Markdown inside this
//             const message = `✅ Thanks for your message: *"${text}"*\nHave a great day! 👋🏻`;

//             // Send our new message back in Markdown
//             await bot.sendMessage(id, message, {parse_mode: 'Markdown'});
//         }
//     }
//     catch(error: any) {
//         // If there was an error sending our message then we 
//         // can log it into the Vercel console
//         console.error('Error sending message');
//         console.log(error.toString());
//     }
    
//     // Acknowledge the message with Telegram
//     // by sending a 200 HTTP status code
//     response.send('OK');
// };
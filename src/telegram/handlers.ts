import { Message } from 'node-telegram-bot-api';

export const webappurl = 'https://tic-tac-toe-web-app.vercel.app/';
export const webappurlTelegram = 'https://t.me/tic_tak_toe_bot/tictactoe';

export const handleStart = (bot: any) => (msg: Message) => {
    const chatId = msg.chat.id;
    console.log(msg.from?.id)

    // bot.sendMessage(chatId, "Welcome", {
    //     reply_markup: {
    //         keyboard: [
    //             [{
    //                 text: 'Start web app', 
    //                 web_app: { url: webappurl }
    //             }], 
    //         ],
    //         resize_keyboard: true, 
    //     }
    // });

    bot.sendMessage(chatId, "Welcome", {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: 'Start web app',
                    url: `${webappurlTelegram}?startapp=chatId__${chatId}`
                }
            ]] 
        }
    });  
};

export const handleHello = (bot: any) => (msg: Message) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hello, World!');
};

export const handleMessage = (bot: any) => (msg: Message) => {
    const chatId = msg.chat.id;
    console.log(msg);
};
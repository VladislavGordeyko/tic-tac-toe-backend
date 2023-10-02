import TelegramBot, { Message } from 'node-telegram-bot-api';
import { env } from '../../config';

const { WEBAPPURLTELEGRAM } = env;

export const startGameCommand = (bot: TelegramBot) => (msg: Message) => {
    const chatId = msg.chat.id;
    console.log(msg.from?.id)

    bot.sendMessage(chatId, "Welcome", {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: 'Start web app',
                    url: `${WEBAPPURLTELEGRAM}?startapp=chatId__${chatId}`
                }
            ]] 
        }
    });  
};

export const onHelloCommand = (bot: TelegramBot) => (msg: Message) => {
    bot.onText(/\/hello/, (msg: Message) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hello, World!');
});
}

export const handleMessageCommand = (bot: TelegramBot) => (msg: Message) => {
    console.log('message in tg', msg);
};
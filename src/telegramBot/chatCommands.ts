import TelegramBot, { Message } from 'node-telegram-bot-api';
import { env } from '../../config';

const { WEBAPPURLTELEGRAM } = env;

export const startGameCommand = (bot: TelegramBot) => (msg: Message) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, WELCOMETEXT, {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: 'Start!',
                    url: `${WEBAPPURLTELEGRAM}?startapp=chatId__${chatId}`
                }
            ]] 
        }
    });  
};

export const handleMessageCommand = (bot: TelegramBot) => (msg: Message) => {
    console.log('message in tg', msg);
};
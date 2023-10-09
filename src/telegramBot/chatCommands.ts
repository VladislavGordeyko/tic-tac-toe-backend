import TelegramBot, { Message } from 'node-telegram-bot-api';
import { env } from '../../config';
import { WELCOMETEXTGROUP, WELCOMETEXTPRIVATE } from './constants';

const { WEBAPPURLTELEGRAM } = env;

export const startGameCommand = (bot: TelegramBot) => (msg: Message) => {
    const chatId = msg.chat.id;
    console.log(msg);

    if (msg.chat.type === 'private') {
        bot.sendMessage(chatId, WELCOMETEXTPRIVATE, {
            reply_markup: {
                inline_keyboard: [[
                    {
                        text: 'Start!',
                        url: `${WEBAPPURLTELEGRAM}?startapp=onlyAI__${1}`
                    }
                ]]
            }
        });
    } else if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
        bot.sendMessage(chatId, WELCOMETEXTGROUP, {
            reply_markup: {
                inline_keyboard: [[
                    {
                        text: 'Start!',
                        url: `${WEBAPPURLTELEGRAM}?startapp=chatId__${chatId}`
                    }
                ]] 
            }
        }); 
    }

    
};

export const handleMessageCommand = (bot: TelegramBot) => (msg: Message) => {
    console.log('message in tg', msg);
};
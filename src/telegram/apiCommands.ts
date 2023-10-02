import TelegramBot, { Message } from 'node-telegram-bot-api';
import { env } from '../../config';
import { Request } from 'express';

const { WEBAPPURLTELEGRAM } = env;

export const sendMessageToTgChat = (bot: TelegramBot) => (chatId: number, message: string) => {
    bot.sendMessage(chatId, message);
}

export const botProcessUpdate = (bot: TelegramBot, req: Request) => {
    bot.processUpdate(req.body);
}

export const getUserPhoto = (bot: TelegramBot, userId: string) => {
    bot.getUserProfilePhotos(Number(userId)).then((data: any)=> console.log({data}));
}

export const sendGameInviteToChat = (bot: TelegramBot, message: string, chatId: string, sessionId: string,) => {
    bot.sendMessage(chatId, "Join game!", {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: message,
                    url: `${WEBAPPURLTELEGRAM}?startapp=sessionId__${sessionId}`,
                }
            ]] 
        }
    });
};
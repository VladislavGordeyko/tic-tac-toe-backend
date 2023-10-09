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

export const getFileLink = async (bot: TelegramBot, fileId: string) => {
    const link = await bot.getFileLink(fileId);
    return link;
}

export const getUserPhotoLink = async (bot: TelegramBot, userId: string) => {
    try {
       
        const result = await bot.getUserProfilePhotos(Number(userId), {limit: 0, offset: 0});
        if (result.total_count > 0) {
            const link = await getFileLink(bot, result.photos[0][0].file_id);
            return link;
        }
        return ''; 
    } catch (error) {
        return ''; 
    }
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
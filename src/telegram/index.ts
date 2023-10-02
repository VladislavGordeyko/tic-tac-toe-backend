import TelegramBot from 'node-telegram-bot-api';
import { handleStart, handleHello, handleMessage, webappurlTelegram } from './handlers';
import { botOptions, env } from '../../config';

const { TOKEN } = env;

const bot = new TelegramBot(TOKEN, botOptions);

bot.onText(/\/start/, handleStart(bot));
bot.onText(/\/hello/, handleHello(bot));
bot.on('message', handleMessage(bot));

export const sendMessageToTg = (chatId: number, message: string) => {
    bot.sendMessage(chatId, message);
};

export const getUserPhoto = (userId: string) => {
    bot.getUserProfilePhotos(Number(userId)).then((data: any)=> console.log({data}));
}

export const sendGameInviteToChat = (message: string, chatId: string, sessionId: string,) => {
    bot.sendMessage(chatId, "Join game!", {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: message,
                    url: `${webappurlTelegram}?startapp=sessionId__${sessionId}`,
                }
            ]] 
        }
    });
    // bot.sendMessage(chatId, message);
};
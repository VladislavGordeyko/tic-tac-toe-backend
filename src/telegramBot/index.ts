import TelegramBot from 'node-telegram-bot-api';
import { botOptions, env } from '../../config';
import { startGameCommand, handleMessageCommand } from './chatCommands';

const { TOKEN, WEBHOOK } = env;

const bot = new TelegramBot(TOKEN, botOptions);
bot.setWebHook(`${WEBHOOK}/bot${TOKEN}`);

bot.onText(/\/start/, startGameCommand(bot));
bot.on('message', handleMessageCommand(bot));

export default bot;
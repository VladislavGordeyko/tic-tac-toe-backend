import TelegramBot from 'node-telegram-bot-api';
import { botOptions, env } from '../../config';
import { startGameCommand } from './chatCommands';

const { TOKEN, WEBHOOK } = env;

const bot = new TelegramBot(TOKEN, botOptions);
bot.setWebHook(`${WEBHOOK}/bot${TOKEN}`);

bot.onText(/\/start/, startGameCommand(bot));

export default bot;
/**
 * This example demonstrates setting up a webook, and receiving
 * updates in your express app
 */
/* eslint-disable no-console */
import { env } from './config';

const { TOKEN, WEBHOOK } = env;
const port = process.env.PORT;

const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// No need to pass any parameters as we will handle the updates with Express
const bot = new TelegramBot(TOKEN);

// This informs the Telegram servers of the new webhook.
bot.setWebHook(`${WEBHOOK}/bot${TOKEN}`);

const app = express();

// parse the updates to JSON
app.use(express.json());

// We are receiving updates at the route below!
app.post(`/bot${TOKEN}`, (req: any, res: any) => {
    console.log('POST! from bot')
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Start Express Server
app.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
});

// Just to ping!
bot.on('message', (msg: any) => {
    console.log('Message!')
  bot.sendMessage(msg.chat.id, 'I am alive!');
});
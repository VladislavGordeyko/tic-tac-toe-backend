import express, { Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import setupWebSocket from './src/ws';
import { env } from './config';
import router from './src/routes';

// const { TOKEN, WEBHOOK } = env;
// const TelegramBot = require('node-telegram-bot-api');

// No need to pass any parameters as we will handle the updates with Express
// const bot = new TelegramBot(TOKEN);

// This informs the Telegram servers of the new webhook.


const app: Express = express();
app.use(cors());
app.use(bodyParser.json());
const { PORT } = env;

app.use(router);


const server = http.createServer(app);
setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server started on ${PORT} port`);
});

// bot.on('message', (msg: any) => {
//   console.log('message', msg)
//   bot.sendMessage(msg.chat.id, 'I am alive!');
// });
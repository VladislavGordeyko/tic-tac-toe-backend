import { Request, Response } from 'express';
import { ISendMessageChatData } from '../telegramBot/models';
import bot from '../telegramBot';
import { botProcessUpdate, getUserPhotoLink, sendGameInviteToChat } from '../telegramBot/apiCommands';
import { env } from '../../config';
import express from 'express';

const router = express.Router();

const { TOKEN } = env;

router.post(`/bot${TOKEN}`, (req: Request, res: Response) => {
  botProcessUpdate(bot, req);
  res.sendStatus(200);
});

router.post('/inviteToGame', (req: Request, res: Response) => {
  const postData: ISendMessageChatData = req.body;

  sendGameInviteToChat(bot, postData.message, postData.chatId, postData.sessionId);
  
  res.json({
    status: 'success',
    message: 'Data received!',
    data: postData
  });
});

router.get('/getUserPhoto', (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (userId) {
    getUserPhotoLink(bot, userId);
  }

  res.json({
    status: 'success',
    message: 'Data received!',
    data: ''
  });
});

export default router;
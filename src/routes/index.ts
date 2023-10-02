import { Request, Response } from 'express';
import { SendMessageChatData } from '../models/tgPostData';
import bot from '../telegram';
import { botProcessUpdate, getUserPhoto, sendGameInviteToChat } from '../telegram/apiCommands';
import { env } from '../../config';

const express = require('express');
const router = express.Router();


const { TOKEN } = env;
// router.get('/', (req: Request, res: Response) => {
//     sendMessageToTg(73630328, "message send from ticatactoe!");
// });

router.post(`/bot${TOKEN}`, (req: Request, res: Response) => {
    console.log('POST! from bot');
    botProcessUpdate(bot, req);
    res.sendStatus(200);
});



router.post('/inviteToGame', (req: Request, res: Response) => {
    const postData: SendMessageChatData = req.body;
    console.log('/inviteToGame', postData);

    sendGameInviteToChat(bot, postData.message, postData.chatId, postData.sessionId);
  
    res.json({
        status: 'success',
        message: 'Data received!',
        data: postData
    });
});

router.get('/getUserPhoto', (req: Request, res: Response) => {
    const userId = req.query.userId as string;
    console.log({userId})
    if (userId) {
        getUserPhoto(bot, userId);
    }

    res.json({
        status: 'success',
        message: 'Data received!',
        data: ''
    });
});







// router.post('/', (req: Request, res: Response) => {
//     const postData: PostData = req.body;
//     console.log(postData);

//     sendGameInviteToChat(-1001828521159, postData.sessionId);
  
//     res.json({
//         status: 'success',
//         message: 'Data received!',
//         data: postData
//     });
// });

export default router;
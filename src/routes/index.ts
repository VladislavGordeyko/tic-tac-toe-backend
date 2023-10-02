import { Request, Response } from 'express';
import { PostData, SendMessageChatData } from '../models/tgPostData';
import { getUserPhoto, sendGameInviteToChat, sendMessageToTg } from '../telegram';

const express = require('express');
const router = express.Router();

// router.get('/', (req: Request, res: Response) => {
//     sendMessageToTg(73630328, "message send from ticatactoe!");
// });

router.post('/inviteToGame', (req: Request, res: Response) => {
    const postData: SendMessageChatData = req.body;
    console.log('/inviteToGame', postData);

    sendGameInviteToChat(postData.message, postData.chatId, postData.sessionId);
  
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
        getUserPhoto(userId);
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
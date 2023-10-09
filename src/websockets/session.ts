import { IGamePayload, IPlayer, ISession, ITelegramData, WSMessageType } from "./models";
import bot from '../telegramBot';
import { v4 as uuidv4 } from 'uuid';
import { getUserPhotoLink } from "../telegramBot/apiCommands";
import { getInitialGameStatus, sendToAllClientsInSession } from "./utils";
import { connectedClients, sessions } from "./ws";
import { WebSocket } from "ws";
import { sendSessionError } from "./error";

const createUser = async (data: ITelegramData, clientId: string) => {
    const avatar = await getUserPhotoLink(bot, data.user?.id);
    return {
        clientId,
        userName: data.user?.username || data.user?.first_name || 'anonymous',
        tgId: data.user?.id,
        avatar
    };
};

export const createSession = async (data: any, clientId: string, ws: WebSocket) => {
    const sessionId = uuidv4();
    const user = await createUser(data.telegramData, clientId);
    const player: IPlayer = { ...user, score: 0, isCurrentMove: true };

    const newSession: ISession = {
        id: sessionId,
        spectators: [],
        players: [player],
        gameStatus: getInitialGameStatus(player),
    };

    sessions[sessionId] = newSession;

    const payload: IGamePayload = { 
        type: WSMessageType.SESSION_CREATED, 
        sessionId,
         clientId, 
         gameStatus: newSession.gameStatus, 
         players: newSession.players 
        };

    ws.send(JSON.stringify(payload));
}

export const joinSession = async (data: any, clientId: string, ws: WebSocket) => {
    const sessionId = data.sessionId;


    if (!sessions[sessionId]) {
        sendSessionError(ws, 'Session not found!');
        return;
    }

    const session = sessions[sessionId];
    const user = await createUser(data.telegramData, clientId);
    if (sessions[sessionId].players.length < 2) {
        const player: IPlayer = { ...user, score: 0, isCurrentMove: false };
        sessions[sessionId].players.push(player);
        session.gameStatus.started = true;
    } else {
        sessions[sessionId].spectators.push(user);
    }
    // const userToStart = session.players.filter(player => player.clientId === clientId)[0];
    // session.gameStatus.status = `Next player: ${userToStart?.userName || 'X'}`;

    const payload = {
        type: WSMessageType.SESSION_JOINED,
        sessionId,
        gameStatus: sessions[sessionId].gameStatus,
        clientId,
        players: sessions[sessionId].players,
        spectators: sessions[sessionId].spectators
    };

    sendToAllClientsInSession(sessions[sessionId], connectedClients, payload);
}

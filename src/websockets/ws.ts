import { Server } from 'ws';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import {  IClientArray, ISessionArray } from './models';
import { handleClose, handleMessage } from './handlers';

export const connectedClients: IClientArray = {};
export const sessions: ISessionArray = {};

const setupWebSocket = (server: any) => {
  const wss = new Server({ server });

  wss.on('connection', (ws: WebSocket) => {
    const clientId = uuidv4();
    connectedClients[clientId] = { clientId, ws };

    ws.on('message', (message) => handleMessage(message, clientId, ws));

    ws.on('close', () => handleClose(clientId));
  });
};

export default setupWebSocket;
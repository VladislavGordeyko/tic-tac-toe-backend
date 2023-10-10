import WebSocket from 'ws';
import { createSession, joinSession } from './session';
import { gameMove, restartGame } from './game';
import { connectedClients, sessions } from './ws';
import { getInitialGameStatus, getRemainingPlayers, getRemainingSpectators, sendToAllClientsInSession } from './utils';
import { IGamePayload, WSMessageType } from './models';

export const handleMessage = async (message: WebSocket.Data, clientId: string, ws: WebSocket) => {
  const data = JSON.parse(message.toString());

  switch (data.type) {
  case 'CREATE_SESSION':
    await createSession(data, clientId, ws);
    break;
  case 'JOIN_SESSION':
    await joinSession(data, clientId, ws);
    break;
  case 'MOVE':
    gameMove(data, ws);
    break;
  case 'RESTART_GAME':
    restartGame(data);
    break;
  default:
    break;
  }
};

export const handleClose = (clientId: string) => {
  // Cleanup: Remove the disconnected client from connectedClients and any session they're part of
  delete connectedClients[clientId];
      
  for (const sessionId in sessions) {
    const session = sessions[sessionId];
    session.players = getRemainingPlayers(session.players, clientId);
    session.spectators = getRemainingSpectators(session.spectators, clientId);
          
    // If no remaining players in the session, delete the session.
    if (session.players.length === 0) {
      delete sessions[sessionId];
      continue; // Skip to next iteration as there's no session left to notify
    }

    // Assign the clientId of the first remaining player to gameStatus
    const gameStatus = getInitialGameStatus();
    gameStatus.currentMoveClientId = session.players[0].clientId;
    sessions[sessionId].gameStatus = gameStatus;

    const payload : IGamePayload = {
      type: WSMessageType.USER_DISCONNECTED,
      gameStatus,
      players: session.players,
      spectators: session.spectators,
    };
    sendToAllClientsInSession(session, connectedClients, payload);
  }
};
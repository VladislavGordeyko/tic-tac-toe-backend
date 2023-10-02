import { Server } from 'ws';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { SquareValue } from './models/tictactoe';
import { calculateWinner } from './utils/tictactoe';

type TelegramData = {
  user: {
    id: string,
    first_name: string, 
    last_name: string, 
    language_code: string, 
    username: string,
  }
  start_param?: string,
}

type Client = {
    clientId: string;
    ws: WebSocket;
  };

  type Player = {
    clientId: string,
    userName: string,
    tgId: string,
    firstName: string,
    isSpectator: boolean,
    score: number,
    isCurrentMove: boolean,
  }

  type Session = {
    id: string;
    players: Player[];  // Array of players
    game: {
      squares: SquareValue[],
      currentMoveClientId: string,
      isXNext: boolean,
      isFinished: boolean,
      winner: SquareValue,
      winnerUserName?: string,
      started: boolean,
      status: string,
    };
  };
  
const connectedClients: { [clientId: string]: Client } = {};
const sessions: { [id: string]: Session } = {};

const setupWebSocket = (server: any) => {
  const wss = new Server({ server });

  wss.on('connection', (ws: WebSocket) => {
    const clientId = uuidv4();
    connectedClients[clientId] = { clientId, ws };
    console.log('connection');

    ws.send(JSON.stringify({ type: 'CLIENT_ID', clientId }));

   
    ws.on('message', (message: WebSocket.Data) => {
      const data = JSON.parse(message.toString());

      switch (data.type) {
        case 'CREATE_SESSION':
            const sessionId = uuidv4();
            const userData : TelegramData = data.telegramData;
            console.log('USER DATA', userData);
            const newSession: Session = {
            id: sessionId,
            
            players: [{
              clientId,
              userName: userData.user?.username || 'linken_vlad',
              firstName: userData.user?.first_name || 'Vlad',
              tgId: userData.user?.id || '123213',
              isSpectator: false,
              score: 0,
              isCurrentMove: true,
            }],
            game: {
                squares: Array(9).fill(null),
                isXNext: true,
                currentMoveClientId: clientId,
                isFinished: false,
                winner: null,
                started: false,
                status: 'Waiting for another player to join'
            },
            };

            sessions[sessionId] = newSession;
            // console.log({connectedClients}, {sessions})
            ws.send(JSON.stringify({ 
              type: 'SESSION_CREATED', 
              sessionId, 
              clientId, 
              gameStatus: newSession.game,
              players: newSession.players,
            }));
            console.log('SESSION CREATED', sessionId, {data})
            break;
        
        case 'JOIN_SESSION':
            const joinSessionId = data.sessionId;
            // console.log('try to connect', {joinSessionId}, sessions[joinSessionId], sessions[joinSessionId]?.players.length)
            if (sessions[joinSessionId] && sessions[joinSessionId]?.players.length < 2) {
              const userData: TelegramData = data.telegramData;
              console.log('USER DATA', userData);
              const newPlayer: Player = {
                clientId,
                userName: userData.user.username,
                firstName: userData.user.first_name,
                tgId: userData.user.id,
                isSpectator: sessions[joinSessionId].players.length > 2,
                score: 0,
                isCurrentMove: false,
              };
              sessions[joinSessionId].players.push(newPlayer);
              // ws.send(JSON.stringify({ type: 'SESSION_JOINED', sessionId: joinSessionId }));
              const session = sessions[joinSessionId];
              session.players.forEach(player => {
                if (connectedClients[player.clientId]) {
                  console.log('SESSION_JOINED', {clientId}, sessions[joinSessionId].players, {data})
                  session.game.started = true;
                  const user = session.players.filter(player => player.clientId === clientId)[0];
                  session.game.status = `Next player: ${user.userName ? user.userName : 'X'}`;
                  connectedClients[player.clientId].ws.send(JSON.stringify({ 
                    type: 'SESSION_JOINED', 
                    sessionId: joinSessionId,
                    gameStatus: session.game,
                    clientId: clientId,
                    players: session.players
                  }));

                }
              });
            
            } else {
              ws.send(JSON.stringify({ type: 'SESSION_ERROR', message: 'Session not found or full.' }));
              console.log('SESSION_ERROR', 'Session not found or full.')
            }
            break;

          case 'MOVE':
              const moveSessionId = data.sessionId;
              const squareIndex = data.index;
              const currentClientId = data.clientId;
              console.log('MOVE', {squareIndex}, {moveSessionId})
      
              if (sessions[moveSessionId]) {
                const session = sessions[moveSessionId];
                const { game } = session;
                if (game.squares[squareIndex] === null) {
                  const opponent = session.players.filter(player => player.clientId !== currentClientId)[0];
                  game.squares[squareIndex] = game.isXNext ? 'X' : 'O';
                  game.isXNext = !game.isXNext;
                  game.currentMoveClientId = opponent.clientId;
                  game.winner = calculateWinner(game.squares);

                  if (game.winner) {
                    game.winnerUserName = session.players.filter(i => i.clientId === currentClientId)[0].userName;
                    game.isFinished = true;
                  }
                  if (game?.winner) {
                    game.status = `Winner: ${game.winnerUserName || game.winner}!`;
                  } else if (!game?.squares.includes(null)) {
                    game.status = 'Draw!';
                  } else {
                    game.status = `Next player: ${opponent.userName ? opponent.userName : game.isXNext ? 'X' : 'O'}`;
                  }
                  
                  // Broadcasting the updated state to both players
                  session.players.forEach(player => {
                    if (connectedClients[player.clientId]) {
                      connectedClients[player.clientId].ws.send(JSON.stringify({ 
                        type: 'MOVE', 
                        gameStatus: session.game
                      }));
                    }
                  });
                }
              } else {
                ws.send(JSON.stringify({ type: 'ERROR', message: 'Invalid session.' }));
              }
              break;


          case 'RESTART_GAME':
              const restartSessionId = data.sessionId;
              if (sessions[restartSessionId]) {
                const session = sessions[restartSessionId];
                const random = Math.floor(Math.random() * session.players.length);
                const nextPlayerMove = session.players[random];
                session.game = {
                  squares: Array(9).fill(null),
                  isXNext: true,
                  currentMoveClientId: nextPlayerMove.clientId,
                  isFinished: false,
                  winner: null,
                  started: true,
                  status: `Next player: ${nextPlayerMove.userName}`
                };
                session.players.forEach(player => {
                  if (connectedClients[player.clientId]) {
                    connectedClients[player.clientId].ws.send(JSON.stringify({ 
                      type: 'RESTART_GAME', 
                      gameStatus: session.game
                    }));
                  }
                });
              }
             
              break;

        default:
          break;
      }
    });

    ws.on('close', () => {
      console.log('Close')
        // Cleanup: Remove the disconnected client from connectedClients and any session they're part of
        delete connectedClients[clientId];
        for (const sessionId in sessions) {
          sessions[sessionId].players = sessions[sessionId].players.filter(player => player.clientId !== clientId);
          if (sessions[sessionId].players.length === 0) {
            delete sessions[sessionId];
          }
        }
      });
  });
};

export default setupWebSocket;

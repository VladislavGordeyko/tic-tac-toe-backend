import { IGamePayload, IPlayer, IClientArray, ISession, IBaseClient, SquareValue } from './models';

export function getInitialGameStatus(nextPlayerMove?: IPlayer, hasStarted?: boolean) {
  return {
    squares: Array(9).fill(null),
    isXNext: true,
    currentMoveClientId: nextPlayerMove?.clientId || '',
    isFinished: false,
    winner: null,
    started: hasStarted || false,
    status: nextPlayerMove ? `Next player: ${nextPlayerMove.userName}` : 'Waiting for another player to join'
  };
}

export const findPlayerByClientId = (players: Array<any>, clientId: string) : IPlayer =>
  players.find(player => player.clientId === clientId);

export const findOpponentByClientId = (players: Array<any>, clientId: string) : IPlayer =>
  players.find(player => player.clientId !== clientId);

export const getRemainingPlayers = (players: IPlayer[], clientId: string) : IPlayer[] => {
  return players.filter(player => player.clientId !== clientId);
};

export const getRemainingSpectators = (spectators: IBaseClient[], clientId: string) => {
  return spectators.filter(spectator => spectator.clientId !== clientId);
};

export const clearPlayersMove = (players: IPlayer[]) => {
  players.map(player => player.isCurrentMove = false);
};


export const sendToAllClientsInSession = (session: ISession, connectedClients: IClientArray, payload: IGamePayload) => {
  session.players.concat(session.spectators as IPlayer[]).forEach(user => {
    connectedClients[user.clientId].ws.send(JSON.stringify(payload));
  });
};

export const getRandomPlayerForNextMove = (players: IPlayer[]) => {
  const randomIndex = Math.floor(Math.random() * players.length);
  return players[randomIndex];
};


export const calculateWinner = (squares: SquareValue[]): SquareValue => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};
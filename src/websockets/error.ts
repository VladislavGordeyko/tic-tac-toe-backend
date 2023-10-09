import { WebSocket } from "ws";
import { IGamePayload, WSMessageType } from "./models";

export const sendSessionError = (ws: WebSocket, message: string) => {
    const payload: IGamePayload = {
        type: WSMessageType.SESSION_ERROR,
        message: message,
     }
    ws.send(JSON.stringify(payload));
}

import express, { Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import setupWebSocket from './src/websockets/ws';
import { env } from './config';
import router from './src/routes';

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
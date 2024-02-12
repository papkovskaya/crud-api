import 'dotenv/config';
import http from 'http';
import { getPort } from './helpers/get-port';
import './helpers/config';

const PORT = getPort();

export const httpServer = http.createServer((_, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        data: 'Hello World!',
    }));
});

export const startServer = () => {
  httpServer.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
  });
};
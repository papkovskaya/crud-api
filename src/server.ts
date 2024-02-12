import http from 'http';
import { getPort } from './helpers/get-port';
import { routesHandler } from './handleRoutes';
import './helpers/config';

const PORT = getPort();

export const httpServer = http.createServer(routesHandler);

export const startServer = () => {
  httpServer.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
  });
};
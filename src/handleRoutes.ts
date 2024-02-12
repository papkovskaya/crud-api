import { IncomingMessage, ServerResponse } from "http";
import { baseUrl } from "./models/consts";
import { STATUS_CODES } from "./models/status-codes";

export function routesHandler(request: IncomingMessage, response: ServerResponse) {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    switch (request.url) {
        case baseUrl: {
          if (request.method === 'GET') {
            // call get users
            response.end(JSON.stringify('get users'));
          }
          if (request.method === 'POST') {
            // call create user
            response.end(JSON.stringify('create user'));
          }
          break;
        }
        case `${baseUrl}/:userId`: {
            if (request.method === 'GET') {
                // call get user
                response.end(JSON.stringify('get user'));
              }
              if (request.method === 'PUT') {
                // call update user
                response.end(JSON.stringify('update user'));
              }
              if (request.method === 'DELETE') {
                // call delete user
                response.end(JSON.stringify('delete user'));
              }
              break;
        }
        default: {
          response.statusCode = STATUS_CODES.SERVER_ERROR;
          response.end('Server Error Occurs');
        }
    }
} 
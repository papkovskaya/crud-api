import { IncomingMessage, ServerResponse } from "http";
import { baseUrl } from "./models/consts";
import { STATUS_CODES } from "./models/status-codes";
import { getUsers } from "./endpoints/get-users.endpoint";
import { getUser } from "./endpoints/get.user.endpoint";
import { createUser } from "./endpoints/create-user.endpoint";
import { updateUser } from "./endpoints/update-user.endpoint";
import { deleteUser } from "./endpoints/delete-user.endpoint";

export function routesHandler(request: IncomingMessage, response: ServerResponse) {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    const url: string = request.url as string;

    if (url.includes(baseUrl)) {
        const userId: string = request.url?.split('/')[3] as string;

        if (!userId) {
            if (request.method === 'GET') {
                getUsers(request, response);
            } else if (request.method === 'POST') {
                createUser(request, response);
            } else {
                response.statusCode = STATUS_CODES.SERVER_ERROR;
                response.end('Server Error Occurs');
            }
        } else if (request.method === 'GET') {
            getUser(request, response, userId);
        } else if (request.method === 'PUT') {
            updateUser(request, response, userId);
        } else if (request.method === 'DELETE') {
            deleteUser(request, response, userId);
        } else {
            response.statusCode = STATUS_CODES.SERVER_ERROR;
            response.end('Server Error Occurs');
        }
    } else {
        response.statusCode = STATUS_CODES.SERVER_ERROR;
        response.end('Server Error Occurs');
    }
} 
import { IncomingMessage, ServerResponse } from "http";
import * as database from '../helpers/database.util';
import { STATUS_CODES } from "../models/status-codes";

export function updateUser(request: IncomingMessage, response: ServerResponse, id: string): void {
    let body: string = '';
    request.on('data', (chunk) => {
        body += chunk.toString();
    });
    request.on('end', async () => {
        await database.updateUser(id, body).then(() => {
            response.statusCode = STATUS_CODES.CREATED;
            response.end();
        }).catch((error) => {
            if (error === 'invalid') {
                response.statusCode = STATUS_CODES.INVALID;
                response.end("Model or Id is invalid");
            }
            if (error === 'not exist') {
                response.statusCode = STATUS_CODES.DOES_NOT_EXIST;
                response.end("Data doesn't exist");
            }
        })
    })
}
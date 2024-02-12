import { IncomingMessage, ServerResponse } from "http";
import * as database from '../helpers/database.util';
import { STATUS_CODES } from "../models/status-codes";

export async function createUser(request: IncomingMessage, response: ServerResponse): Promise<void> {
    let body: string = '';
    request.on('data', (chunk) => {
        body += chunk.toString();
    });
    request.on('end', async () => {
        await database.saveUser(body).then(() => {
            response.statusCode = STATUS_CODES.CREATED;
            response.end();
        }).catch((_) => {
            response.statusCode = STATUS_CODES.INVALID;
            response.end("Model is invalid");
        })
    })
}
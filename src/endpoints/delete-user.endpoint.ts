import { IncomingMessage, ServerResponse } from "http";
import * as database from '../helpers/database.util';
import { STATUS_CODES } from "../models/status-codes";

export async function deleteUser(_: IncomingMessage, response: ServerResponse, id: string): Promise<void> {
    await database.deleteUser(id).then(() => {
        response.statusCode = STATUS_CODES.DELETED;
        response.end();
    }).catch((error) => {
        if (error === 'invalid') {
            response.statusCode = STATUS_CODES.INVALID;
            response.end("Id is invalid");
        }
        if (error === 'not exist') {
            response.statusCode = STATUS_CODES.DOES_NOT_EXIST;
            response.end("Data doesn't exist");
        }
    })
}
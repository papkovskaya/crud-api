import { IncomingMessage, ServerResponse } from "http";
import * as database from '../helpers/database.util';
import { STATUS_CODES } from "../models/status-codes";

export async function getUser(_: IncomingMessage, response: ServerResponse, id: string): Promise<void> {
    await database.getUserById(id).then((usersData: string) => {
        console.log('ddddd');
        response.statusCode = STATUS_CODES.SUCCESS;
        response.end(JSON.stringify(usersData));
    }).catch((error) => {
        if (error === 'not uuid') {
            response.statusCode = STATUS_CODES.INVALID;
            response.end("Id is invalid");
        }
        if (error === 'not exist') {
            response.statusCode = STATUS_CODES.DOES_NOT_EXIST;
            response.end("Data doesn't exist");
        }
    })
}
import { IncomingMessage, ServerResponse } from "http";
import * as database from '../helpers/database.util';
import { STATUS_CODES } from "../models/status-codes";

export async function getUsers(_: IncomingMessage, response: ServerResponse): Promise<void> {
    await database.getUsers().then((usersData: string) => {
        response.statusCode = STATUS_CODES.SUCCESS;
        response.end(usersData);
    }).catch((error) => {
        response.statusCode = STATUS_CODES.SERVER_ERROR;
        response.end(error);
    })
}
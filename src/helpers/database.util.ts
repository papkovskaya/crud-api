import fs from 'fs';
import path from 'path';

export async function createDatabase(): Promise<void> {
    const dbPath = path.resolve(__dirname, 'storage');
    await fs.promises.access(dbPath).catch(async () => {
        await fs.promises.mkdir(dbPath);
        return fs.promises.access(`${dbPath}/storage.json`);
    }).catch(() => {
        fs.createWriteStream(`${dbPath}/storage.json`).close();
    });
}

export async function getUsers(): Promise<void> {
}
export async function getUserById(): Promise<void> {
}
export async function saveUser(): Promise<void> {
}
export async function updateUser(): Promise<void> {
}
export async function deleteUser(): Promise<void> {
}
createDatabase();

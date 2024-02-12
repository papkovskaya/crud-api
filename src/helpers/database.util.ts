import fs from 'fs';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import path from 'path';
import { UserModel } from 'models/user.model';

export async function createDatabase(): Promise<void> {
    const dbPath = path.resolve(__dirname, 'storage');
    await fs.promises.access(dbPath).catch(async () => {
        await fs.promises.mkdir(dbPath);
        return fs.promises.access(`${dbPath}/storage.json`);
    }).catch(() => {
        const writebleStream = fs.createWriteStream(`${dbPath}/storage.json`);
        writebleStream.write(Buffer.from([]));
        writebleStream.close();
    });
}

export async function getUsers(): Promise<string> {
    return new Promise((resolve, reject) => {
        const filepath = path.resolve(__dirname, 'storage/storage.json');
        const readableStream = fs.createReadStream(filepath);
        const chunks: Buffer[] = [];
        readableStream.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
        });
        readableStream.on('close', () => {
            resolve(Buffer.concat(chunks).toString());
        });
        readableStream.on('error', () => {
            reject('error');
        })
    })
}
export async function getUserById(userId: string): Promise<string> {
    if (!uuidValidate(userId)) {
        return Promise.reject('not uuid');
    }
    return getUsers().then((userData: string) => {
        let currentDB = [];
        if (userData) {
            currentDB = JSON.parse(userData);
        }
        const foundData: string = currentDB.find((data: UserModel) => {
            return data.id === userId
        }) as string;
        return Boolean(foundData) ? Promise.resolve(foundData) : Promise.reject('not exist');
    });
}
export async function saveUser(userDataStr: string): Promise<void> {
    const userData = JSON.parse(userDataStr);

    if (!userData || !userData.age || !userData.username || !Array.isArray(userData.hobbies)) {
        return Promise.reject('not valid');
    }

    return new Promise((resolve, reject) => {
        return getUsers().then((users: string) => {
            let currentDB = [];
            const dbPath = path.resolve(__dirname, 'storage');
            const newUserData = {
                ...userData,
                id: uuidv4()
            };
            if (users) {
                currentDB = JSON.parse(users);
            }
            const newDB = JSON.stringify([...currentDB, newUserData]);
            const writebleStream = fs.createWriteStream(`${dbPath}/storage.json`);
            writebleStream.write(Buffer.from(newDB));
            writebleStream.close();

            writebleStream.on('close', () => {
                resolve();
            });
            writebleStream.on('error', () => {
                reject('error');
            })
        })
    });
}
export async function updateUser(userId: string, newData: string): Promise<void> {
    if (!uuidValidate(userId)) {
        return Promise.reject('not uuid');
    }
    return getUsers().then((userData: string) => {
        return new Promise(async (resolve, reject) => {
            let currentDB = [];
            if (userData) {
                currentDB = JSON.parse(userData);
            }
            const newArray: UserModel[] = [];
            const newDataModel = JSON.parse(newData);
            let dataIsUpdated: boolean = false;
            JSON.parse(currentDB).forEach((data: UserModel) => {
                if (data.id === userId) {
                    newArray.push({
                        ...data,
                        ...newDataModel
                    });
                    dataIsUpdated = true;
                } else {
                    newArray.push(data)
                }
            });
            if (!dataIsUpdated) {
                return reject('not exist');
            }
            const dbPath = path.resolve(__dirname, 'storage/storage.json');
            await fs.promises.rm(dbPath);
            const writebleStream = fs.createWriteStream(`${dbPath}`);
            writebleStream.write(Buffer.from(JSON.stringify(newArray)));
            writebleStream.close();
            writebleStream.on('close', () => {
                resolve();
            });
            writebleStream.on('error', () => {
                reject('error');
            })
        })
    });
}
export async function deleteUser(userId: string): Promise<void> {
    if (!uuidValidate(userId)) {
        return Promise.reject('not uuid');
    }
    return getUsers().then((userData: string) => {
        return new Promise(async (resolve, reject) => {
            const newArray: UserModel[] = [];
            const currentArray: UserModel[] = JSON.parse(userData);
            currentArray.forEach((data: UserModel) => {
                if (data.id !== userId) {
                    newArray.push(data);
                }
            });

            if (currentArray.length === newArray.length) {
                return reject('not exist');
            }

            const dbPath = path.resolve(__dirname, 'storage/storage.json');
            await fs.promises.rm(dbPath);
            const writebleStream = fs.createWriteStream(`${dbPath}`);
            writebleStream.write(Buffer.from(JSON.stringify(newArray)));
            writebleStream.close();
            writebleStream.on('close', () => {
                resolve();
            });
            writebleStream.on('error', () => {
                reject('error');
            })
        })
    });
}
createDatabase();

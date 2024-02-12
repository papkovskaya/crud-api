import fs from 'fs';
import { UserModel } from 'models/user.model';
import path from 'path';

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
    return getUsers().then((userData: string) => {
        const foundData: string = Array.from(userData).find((data: string) => {
            const userDataModel: UserModel = JSON.parse(data);
            return userDataModel.id === userId
        }) as string;
        return Boolean(foundData) ? Promise.resolve(foundData) : Promise.reject('error');
    });
}
export async function saveUser(userData: UserModel): Promise<void> {
    return new Promise((resolve, reject) => {
        const dbPath = path.resolve(__dirname, 'storage');
        const userDataString = JSON.stringify(userData);
        const writebleStream = fs.createWriteStream(`${dbPath}/storage.json`);
        writebleStream.write(Buffer.from(userDataString));
        writebleStream.close();

        writebleStream.on('close', () => {
            resolve();
        });
        writebleStream.on('error', () => {
            reject('error');
        })
    });
}
export async function updateUser(userId: string, newData: string): Promise<void> {
    return getUsers().then((userData: string) => {
        return new Promise(async (resolve, reject) => {
            const newArray: UserModel[] = [];
            const newDataModel = JSON.parse(newData);
            Array.from(userData).forEach((data: string) => {
                const userDataModel: UserModel = JSON.parse(data);
                if (userDataModel.id === userId) {
                    newArray.push({
                        ...userDataModel,
                        ...newDataModel
                    })
                } else {
                    newArray.push(userDataModel)
                }
            });
            const dbPath = path.resolve(__dirname, 'storage/storage.json');
            await fs.promises.rm(dbPath);
            const writebleStream = fs.createWriteStream(`${dbPath}`);
            writebleStream.write(Buffer.from(newArray.toString()));
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
    return getUsers().then((userData: string) => {
        return new Promise(async (resolve, reject) => {
            const newArray: UserModel[] = [];
            Array.from(userData).forEach((data: string) => {
                const userDataModel: UserModel = JSON.parse(data);
                if(userDataModel.id !== userId) {
                    newArray.push(userDataModel);
                }
            });
            const dbPath = path.resolve(__dirname, 'storage/storage.json');
            await fs.promises.rm(dbPath);
            const writebleStream = fs.createWriteStream(`${dbPath}`);
            writebleStream.write(Buffer.from(newArray.toString()));
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

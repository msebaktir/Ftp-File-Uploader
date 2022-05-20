import fs from "fs";
import path from "path";
import { ConnectionInfo, FileInfo } from "./types";
export function HandleProccessArguments(allArgs: string[]) {
    let config: ConnectionInfo = {
        ftpServer: allArgs[0],
        ftpUserName: allArgs[1],
        ftpPassword: allArgs[2],
        remoteUploadDir: allArgs[3],
        localSourceDir: allArgs[4],
        removeAllFilesAndDirectory: allArgs[5] === "true",
        maxTryedConnectionCount: parseInt(allArgs[6]),
    };
    return config;
}

export async function GetAllFilesAndDirectoryPath(directoryPath: string) {
    const filesAndDirectoryPath = await new Promise<Array<string>>(
        (resolve, reject) => {
            fs.readdir(directoryPath, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files);
                }
            });
        }
    );
    const allFiles: FileInfo[] = [];
    for (let file of filesAndDirectoryPath) {
        const filePath = path.join(directoryPath, file);
        const fileStat = fs.statSync(filePath);
        const fileInfo: FileInfo = {
            name: file,
            path: filePath,
            isDirectory: fileStat.isDirectory(),
            size: fileStat.size,
        };
        allFiles.push(fileInfo);
    }
    return allFiles;
}

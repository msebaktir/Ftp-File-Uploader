export type FileInfo = {
    name: string;
    path: string;
    isDirectory: boolean;
    size: number;
};

export type ConnectionInfo = {
    ftpServer: string;
    ftpUserName: string;
    ftpPassword: string;
    remoteUploadDir: string;
    localSourceDir: string;
    removeAllFilesAndDirectory: boolean;
    maxTryedConnectionCount: number;
}
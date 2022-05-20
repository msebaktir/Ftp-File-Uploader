import * as ftp from "basic-ftp";

export class FtpChannel {
    private ftpServer: string;
    private ftpUserName: string;
    private ftpPassword: string;
    private maxTryedConnectionCount: number = 3;
    private remoteUploadDir: string;
    private localSourceDir: string;
    private client: any;
    constructor(
        ftpServer: string,
        ftpUserName: string,
        ftpPassword: string,
        maxTryedConnectionCount: number = 3
    ) {
        this.ftpServer = ftpServer;
        this.ftpUserName = ftpUserName;
        this.ftpPassword = ftpPassword;
        this.maxTryedConnectionCount = maxTryedConnectionCount;
    }
    private async tryConnect(
        numberOfTryedConnectionCount: number = 0
    ): Promise<ftp.Client> {
        if (numberOfTryedConnectionCount > this.maxTryedConnectionCount) {
            throw new Error("Max tryed connection count reached");
        }
        const client = new ftp.Client();
        try {
            await client.access({
                host: this.ftpServer,
                user: this.ftpUserName,
                password: this.ftpPassword,
                secure: true,
            });
            return client;
        } catch (error) {
            console.error(error);
            return this.tryConnect(numberOfTryedConnectionCount + 1);
        }
    }

    public async CreateConnection() {
        const connection = await this.tryConnect();
        this.client = connection;
        return connection;
    }
    public async CloseConnection() {
        await this.client.close();
    }
    public async CreateDirectory(directoryPath:string,directoryName:string){
        await this.client.mkdir(directoryPath+directoryName);
    }
    public async removeAllFilesAndDirectory(){
        await this.client.rmdir("/", true);
    }
    public async UploadFile(file:FileInfo){
        await this.client.put(file.path,file.name);
    }
    public async UploadFiles(files:FileInfo[]){
        for(let file of files){
            await this.UploadFile(file);
        }
    }
}

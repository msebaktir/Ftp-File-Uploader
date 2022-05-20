import { FtpChannel } from './FtpChannel';
import { GetAllFilesAndDirectoryPath, HandleProccessArguments } from "./Utils";


if(process.argv.slice(2).length < 3){
    console.log("Usage: node index.js ftpServer ftpUserName ftpPassword remoteUploadDir localSourceDir maxTryedConnectionCount");
    process.exit(1);
}


const parsedConnectionInfo = HandleProccessArguments(process.argv.slice(2));
const constAllFiles = await GetAllFilesAndDirectoryPath(parsedConnectionInfo.localSourceDir);
const ftpClient = new FtpChannel(parsedConnectionInfo.ftpServer,parsedConnectionInfo.ftpUserName,parsedConnectionInfo.ftpPassword,parsedConnectionInfo.maxTryedConnectionCount);

ftpClient.CreateConnection();
ftpClient.CreateDirectory(parsedConnectionInfo.remoteUploadDir,"/");
if(parsedConnectionInfo.removeAllFilesAndDirectory)
    ftpClient.removeAllFilesAndDirectory();

// cereate directories
for(let file of constAllFiles.filter(x=>x.isDirectory)){
    ftpClient.CreateDirectory(parsedConnectionInfo.remoteUploadDir,file.name);
}

ftpClient.UploadFiles(constAllFiles.filter(x=>!x.isDirectory));


console.log("Done");

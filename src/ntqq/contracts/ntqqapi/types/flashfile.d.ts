export declare enum FlashFileUploadStatus {
    UPLOADED = 4
}
export interface FlashFileSetInfo {
    fileSetId: string;
    name: string;
    totalFileCount: string;
    totalFileSize: string;
    shareInfo: {
        shareLink: string;
        extractionCode: string;
    };
    uploaders: Array<{
        uin: string;
        nickname: string;
        uid: string;
        sendEntrance: string;
    }>;
    uploadInfo: {
        totalUploadedFileSize: string;
        successCount: number;
        failedCount: number;
    };
    expireTime: string;
    expireLeftTime: number;
    status: number;
    uploadStatus: FlashFileUploadStatus;
    downloadStatus: number;
}
export interface FlashFileInfo {
    fileSetId: string;
    cliFileId: string;
    fileType: number;
    name: string;
    fileSize: string;
    saveFilePath?: string;
    status: number;
    uploadStatus: number;
    downloadStatus: number;
    filePhysicalSize: string;
    physical: {
        id: string;
        status: number;
        localPath: string;
    };
}
export interface FlashFileListItem {
    fileList: FlashFileInfo[];
    isEnd: boolean;
    isCache: boolean;
}

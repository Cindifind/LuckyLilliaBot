import { ChatType } from '../types';
import { RkeyManager } from '../helper/rkey';
import { Service, Context } from 'cordis';
import { FlashFileListItem, FlashFileSetInfo } from '../types/flashfile';
declare module 'cordis' {
    interface Context {
        ntFileApi: NTFileApi;
    }
}
export declare class NTFileApi extends Service {
    protected ctx: Context;
    static inject: string[];
    rkeyManager: RkeyManager;
    constructor(ctx: Context);
    getVideoUrl(fileUuid: string, isGroup: boolean): Promise<string>;
    getPttUrl(fileUuid: string, isGroup: boolean): Promise<string>;
    private resolveOldPicUrl;
    getFileUrl(fileUuid: string, isGroup: boolean, receiverUid: string): Promise<{
        retCode: number;
        retMsg: string;
        url: string;
    }>;
    getImageUrl(originImageUrl: string, md5HexStr: string, opts?: {
        fileUuid?: string;
        isGroup?: boolean;
        peerUid?: string;
    }): Promise<string>;
    ocrImage(imageUrl: string): Promise<{
        readonly retCode: number | undefined;
        readonly errMsg: string;
        readonly wording: string | undefined;
        readonly ocrRspBody: {
            textDetections: {
                detectedText: string;
                confidence: number;
                polygon: {
                    coordinates: {
                        x: number;
                        y: number;
                    }[];
                };
                advancedInfo: string;
            }[];
            language: string;
            requestId: string;
            ocrLanguageList: string[];
            dstTranslateLanguageList: string[];
            languageList: {
                languageCode: string;
                languageDesc: string;
            }[];
            afterCompressWeight: number;
            afterCompressHeight: number;
        };
    }>;
    uploadFlashFile(title: string, filePaths: string[]): Promise<any>;
    downloadFlashFile(fileSetId: string, sceneType?: number): Promise<{
        result: number;
        errMsg: string;
    }>;
    flashFileListCache: Map<string, FlashFileListItem[]>;
    getFlashFileList(fileSetId: string, _force?: boolean): Promise<FlashFileListItem[]>;
    getFlashFileSetIdByCode(code: string): Promise<{
        result: number;
        errMsg: string;
        fileSetId: string;
    }>;
    /**
     * 用法: getFlashFileSetIdByCode -> getFlashFileList -> 把选中文件的 fileUuid / name / fileSize 传进来。
     * 签名 URL 1 小时过期。不需要 0x93d1_1 / 0x93e1_0 / 0x93d9_1, 那些只用来更新 Windows QQ 的界面
     */
    getFlashFileDownloadUrl(opts: {
        fileSetId: string;
        fileUuid: string;
        fileName: string;
        fileSize?: number;
        fileSha1Hex?: string;
        fileMd5Hex?: string;
        fileId?: string;
    }): Promise<{
        host: string;
        path: string;
        port: number;
        rkey: string;
        ttl: number;
        fullUrl: string;
    }>;
    flashFileInfoCache: Map<string, FlashFileSetInfo>;
    getFlashFileInfo(fileSetId: string, _force?: boolean): Promise<FlashFileSetInfo>;
    /**
     * 跟 Windows QQ 的"重新分享"一样, 拿新的 share_link (14 天有效)。自己的 fileSet 在 list 里拿不到 sha1 / md5,
     * 要逐个文件走 0x93e5_4, 再按上传流程建新 fileSet, 靠秒传完成。老 fileSet 必须还没过期
     */
    reshareFlashFile(fileSetId: string): Promise<any>;
    uploadGroupVideo(groupCode: string, filePath: string, thumbPath: string, duration: number, width: number, height: number): Promise<{
        msgInfo: Buffer<ArrayBufferLike>;
        compat: Buffer<ArrayBufferLike>;
    }>;
    uploadPrivateVideo(chatType: ChatType, peerUid: string, filePath: string, thumbPath: string, duration: number, width: number, height: number): Promise<{
        msgInfo: Buffer<ArrayBufferLike>;
        compat: Buffer<ArrayBufferLike>;
    }>;
    uploadGroupFile(groupCode: number, filePath: string, fileName: string, parentFolderId?: string): Promise<{
        fileId: string;
        fileSize: number;
        fileMd5: string;
        busId: number;
    }>;
    uploadPrivateFile(chatType: ChatType, peerUid: string, filePath: string, fileName: string): Promise<{
        fileId: string;
        file10MMd5: NonSharedBuffer;
        fileSize: number;
        crcMedia: string;
    }>;
    uploadGroupImage(groupCode: string, filePath: string, width: number, height: number, summary: string, bizType: number): Promise<{
        msgInfo: Buffer<ArrayBufferLike>;
        compat: Buffer<ArrayBufferLike>;
    }>;
    uploadPrivateImage(chatType: ChatType, peerUid: string, filePath: string, width: number, height: number, summary: string, bizType: number): Promise<{
        msgInfo: Buffer<ArrayBufferLike>;
        compat: Buffer<ArrayBufferLike>;
    }>;
    uploadGroupPtt(groupCode: string, filePath: string, duration: number): Promise<{
        msgInfo: Buffer<ArrayBufferLike>;
        compat: Buffer<ArrayBufferLike>;
    }>;
    uploadPrivatePtt(chatType: ChatType, peerUid: string, filePath: string, duration: number): Promise<{
        msgInfo: Buffer<ArrayBufferLike>;
        compat: Buffer<ArrayBufferLike>;
    }>;
    getRKey(): Promise<{
        privateRKey: string;
        groupRKey: string;
        expiredTime: number;
    }>;
}

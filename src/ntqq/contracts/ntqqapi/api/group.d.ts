import { GroupMember, GroupMsgMask, Group, RawMessage } from '../types';
import { Service, Context } from 'cordis';
declare module 'cordis' {
    interface Context {
        ntGroupApi: NTGroupApi;
    }
}
export declare class NTGroupApi extends Service {
    protected ctx: Context;
    static inject: string[];
    private groupsCache;
    private groupCache;
    private membersCache;
    private refreshingMembers;
    constructor(ctx: Context);
    getGroups(forceUpdate: boolean): Promise<Group[]>;
    getGroup(groupCode: number, forceUpdate: boolean): Promise<Group>;
    getGroupMembers(groupCode: number, forceUpdate: boolean): Promise<GroupMember[]>;
    getGroupMemberByUid(groupCode: number, uid: string, forceUpdate: boolean): Promise<GroupMember | undefined>;
    /**
     * 拿不到群成员 (手表拉不了成员列表) 就用消息自带的发送者信息凑一个, 缺的字段留默认值。role 以消息里的为准,
     * 它比缓存新
     */
    getGroupMemberOrFromMessage(message: RawMessage): Promise<GroupMember>;
    getGroupMemberByUin(groupCode: number, uin: number, forceUpdate: boolean): Promise<GroupMember | undefined>;
    getGroupNotifications(doubt: boolean, count: number, startSeq?: number): Promise<{
        nextStartSeq: number;
        notifications: {
            sequence: number;
            type: number;
            requestState: number;
            group: {
                groupCode: number;
                groupName: string;
            };
            user1: {
                uid: string;
                nickName: string;
            };
            user2: {
                uid: string;
                nickName: string;
            } | undefined;
            user3: {
                uid: string;
                nickName: string;
            } | undefined;
            time: number | undefined;
            comment: string | undefined;
        }[];
    }>;
    setGroupRequest(doubt: boolean, groupCode: number, seq: number, type: number, accept: boolean, reason?: string): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    quitGroup(groupCode: number): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    kickGroupMember(groupCode: number, kickUids: string[], refuseForever?: boolean, kickReason?: string): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    /** duration 为秒数，为 0 时解除禁言 */
    muteGroupMember(groupCode: number, memList: {
        uid: string;
        duration: number;
    }[]): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    muteGroup(groupCode: number, shutUp: boolean): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    setGroupMemberCard(groupCode: number, memberUid: string, cardName: string): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    setGroupMemberAdmin(groupCode: number, memberUid: string, isSet: boolean): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    setGroupMemberSpecialTitle(groupCode: number, memberUid: string, specialTitle: string): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    setGroupName(groupCode: number, groupName: string): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    getGroupRemainAtTimes(groupCode: number): Promise<{
        readonly canAtAll: boolean;
        readonly remainAtAllCountForUin: number;
        readonly remainAtAllCountForGroup: number;
        readonly atTimesMsg: string;
        readonly canNotAtAllMsg: string | undefined;
    }>;
    addGroupEssence(groupCode: number, msgSeq: number, msgRandom: number): Promise<{
        readonly retMsg: string;
        readonly retCode: number;
    }>;
    removeGroupEssence(groupCode: number, msgSeq: number, msgRandom: number): Promise<{
        readonly retMsg: string;
        readonly retCode: number;
    }>;
    getGroupRecommendContactArk(groupCode: number): Promise<string>;
    /**
     * GroupAvatarExtra.groupUin 是内部的 groupUin, 不是 groupCode: 传错会被拒 "No Perm" (在 bytesRspExtendInfo.field4,
     * 外层 errorCode 是 0)
     */
    setGroupAvatar(groupCode: string, filePath: string): Promise<{
        result: number;
        errMsg: string;
    }>;
    setGroupMsgMask(groupCode: number, msgMask: GroupMsgMask): Promise<{
        groupCode: number;
        errCode: number;
    }>;
    setGroupRemark(groupCode: string, groupRemark?: string): Promise<any>;
    getGroupFileList(groupCode: number, folderId: string, startIndex: number, fileCount: number): Promise<{
        retCode: number;
        retMsg: string;
        clientWording: string;
        isEnd: boolean;
        items: {
            readonly type: number;
            readonly folderInfo: {
                folderId: string;
                parentFolderId: string;
                folderName: string;
                createTime: number;
                modifyTime: number;
                createUin: number;
                creatorName: string;
                totalFileCount: number;
                modifyUin: number;
                modifyName: string;
                usedSpace: number;
            } | undefined;
            readonly fileInfo: {
                fileId: string;
                fileName: string;
                fileSize: number;
                busId: number;
                uploadedSize: number;
                uploadedTime: number;
                expireTime: number;
                modifiedTime: number;
                downloadedTimes: number;
                fileSha1: Buffer<ArrayBufferLike>;
                fileMd5: Buffer<ArrayBufferLike>;
                uploaderName: string;
                uploaderUin: number;
                parentDirectory: string;
                field17: number;
                field22: string;
            } | undefined;
        }[];
        allFileCount: number;
        nextIndex: number;
    }>;
    getGroupFileCount(groupCode: number): Promise<{
        fileCount: number;
        limitCount: number;
        isFull: boolean;
    }>;
    getGroupFileSpace(groupCode: number): Promise<{
        totalSpace: number;
        usedSpace: number;
    }>;
    deleteGroupFile(groupCode: number, fileId: string, busId?: number): Promise<{
        retCode: number;
        retMsg: string;
        clientWording: string;
    }>;
    moveGroupFile(groupCode: number, fileId: string, curFolderId: string, dstFolderId: string): Promise<{
        retCode: number;
        retMsg: string;
        clientWording: string;
    }>;
    persistGroupFile(groupCode: number, fileId: string): Promise<{
        retCode: number;
        retMsg: string;
        clientWording: string;
    }>;
    renameGroupFile(groupCode: number, fileId: string, parentFolderId: string, newFileName: string): Promise<{
        retCode: number;
        retMsg: string;
        clientWording: string;
    }>;
    forwardGroupFile(groupCode: number, dstUin: number, fileId: string, busId: number, toFriend: boolean): Promise<{
        retCode: number;
        retMsg: string;
        clientWording: string;
        saveFilePath: string;
        busId: number;
        fileName: string;
    }>;
    createGroupFolder(groupCode: number, folderName: string): Promise<{
        retCode: number;
        retMsg: string;
        clientWording: string;
        folderInfo: {
            folderId: string;
            folderPath: string;
            folderName: string;
        };
    }>;
    deleteGroupFolder(groupCode: number, folderId: string): Promise<{
        retCode: number;
        retMsg: string;
        clientWording: string;
    }>;
    renameGroupFolder(groupCode: number, folderId: string, newFolderName: string): Promise<{
        retCode: number;
        retMsg: string;
        clientWording: string;
    }>;
    getGroupAlbumList(groupCode: number): Promise<{
        retCode: number;
        retMsg: string;
        albumList: {
            readonly albumId: string;
            readonly owner: string;
            readonly name: string;
            readonly desc: string;
            readonly createTime: number;
            readonly modifyTime: number;
            readonly lastUploadTime: number;
            readonly uploadNumber: number;
            readonly cover: {
                readonly type: number;
                readonly image: {
                    readonly lloc: string;
                    readonly photoUrl: {
                        readonly spec: number;
                        readonly url: {
                            readonly url: string;
                            readonly width: number;
                            readonly height: number;
                        };
                    }[];
                    readonly defaultUrl: {
                        readonly url: string;
                        readonly width: number;
                        readonly height: number;
                    } | undefined;
                } | undefined;
            } | undefined;
            readonly creator: {
                readonly nick: string;
                readonly uin: string;
            } | undefined;
        }[];
    }>;
    createGroupAlbum(groupCode: number, name: string, desc: string): Promise<{
        retCode: number;
        retMsg: string;
        info: {
            albumId: string;
            groupCode: string;
            name: string;
            desc: string;
        } | undefined;
    }>;
    deleteGroupAlbum(groupCode: number, albumId: string): Promise<{
        readonly retCode: number;
        readonly retMsg: string;
    }>;
    getGroupAlbumMediaList(groupCode: number, albumId: string, attachInfo?: string): Promise<{
        readonly retCode: number;
        readonly retMsg: string;
        readonly body: {
            album: {
                readonly albumId: string;
                readonly owner: string;
                readonly name: string;
                readonly desc: string;
                readonly createTime: number;
                readonly modifyTime: number;
                readonly lastUploadTime: number;
                readonly uploadNumber: number;
                readonly cover: {
                    readonly type: number;
                    readonly image: {
                        readonly lloc: string;
                        readonly photoUrl: {
                            readonly spec: number;
                            readonly url: {
                                readonly url: string;
                                readonly width: number;
                                readonly height: number;
                            };
                        }[];
                        readonly defaultUrl: {
                            readonly url: string;
                            readonly width: number;
                            readonly height: number;
                        } | undefined;
                    } | undefined;
                } | undefined;
                readonly creator: {
                    readonly nick: string;
                    readonly uin: string;
                } | undefined;
            } | undefined;
            mediaList: {
                readonly type: number;
                readonly image: {
                    readonly lloc: string;
                    readonly photoUrl: {
                        readonly spec: number;
                        readonly url: {
                            readonly url: string;
                            readonly width: number;
                            readonly height: number;
                        };
                    }[];
                    readonly defaultUrl: {
                        readonly url: string;
                        readonly width: number;
                        readonly height: number;
                    } | undefined;
                } | undefined;
                readonly video: {
                    readonly id: string;
                    readonly url: string;
                    readonly cover: {
                        lloc: string;
                        photoUrl: {
                            readonly spec: number;
                            readonly url: {
                                readonly url: string;
                                readonly width: number;
                                readonly height: number;
                            };
                        }[];
                        defaultUrl: {
                            readonly url: string;
                            readonly width: number;
                            readonly height: number;
                        } | undefined;
                    };
                    readonly width: number;
                    readonly height: number;
                    readonly videoTime: number;
                    readonly videoUrl: {
                        spec: number;
                        url: {
                            url: string;
                            width: number;
                            height: number;
                        };
                    }[];
                } | undefined;
                readonly desc: string;
                readonly uploader: string;
                readonly batchId: number;
                readonly uploadTime: number;
                readonly like: {
                    key: string;
                } | undefined;
            }[];
            nextAttachInfo: string;
            nextHasMore: boolean;
        } | undefined;
    }>;
    setGroupPin(groupCode: number, isPinned: boolean): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    sendGroupNudge(groupCode: number, targetUin: number): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    groupClockIn(groupCode: number): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
}

import type { QQProtocolBase } from '../base';
export declare function GroupMixin<T extends abstract new (...args: any[]) => QQProtocolBase>(Base: T): T & (abstract new (...args: any[]) => GroupMixinMethods);
/** Public methods contributed by this protocol mixin. */
export interface GroupMixinMethods {
    sendGroupPoke(groupCode: number, memberUin: number): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    setSpecialTitle(groupCode: number, memberUid: string, title: string): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    groupClockIn(groupCode: string): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    getGroupFileUrl(groupCode: number, fileId: string): Promise<{
        readonly download: {
            retCode: bigint;
            clientWording: string;
            downloadDns: string;
            downloadUrl: Buffer<ArrayBufferLike>;
        };
    }>;
    fetchGroups(): Promise<{
        readonly groups: {
            groupCode: number;
            info: {
                groupOwner: {
                    uid: string;
                };
                createdTime: number;
                memberMax: number;
                memberCount: number;
                groupName: string;
                topTime: number | undefined;
                groupShutupExpireTime: number | undefined;
                description: string | undefined;
                question: string | undefined;
                richDescription: string | undefined;
                announcement: string | undefined;
            };
            personInfo: {
                memberRole: number;
                remark: string | undefined;
                personShutupExpireTime: number | undefined;
                msgMask: number;
            };
        }[];
    }>;
    getGroupFileList(groupCode: number, targetDirectory: string, startIndex: number, fileCount: number): Promise<{
        readonly listResp: {
            retCode: bigint;
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
        };
    }>;
    getGroupFileCount(groupCode: number, busId?: number): Promise<{
        readonly countResp: {
            fileCount: number;
            limitCount: number;
            isFull: boolean;
        };
    }>;
    getGroupFileSpace(groupCode: number): Promise<{
        readonly spaceResp: {
            totalSpace: bigint;
            usedSpace: bigint;
        };
    }>;
    feedGroupFile(groupCode: number, fileId: string, msgRandom: number, busId: number): Promise<{
        readonly feedsInfoRsp: {
            retCode: bigint;
            retMsg: string;
            clientWording: string;
            feedsResultList: {
                retCode: bigint;
                detail: string;
                fileId: string;
                busId: number;
                deadTime: number;
                msgSeq: number;
            }[];
            svrBusyWaitTime: number;
        };
    }>;
    deleteGroupFile(groupCode: number, fileId: string, busId?: number): Promise<{
        readonly delete: {
            retCode: bigint;
            retMsg: string;
            clientWording: string;
        };
    }>;
    moveGroupFile(groupCode: number, fileId: string, parentDirectory: string, targetDirectory: string): Promise<{
        readonly move: {
            retCode: bigint;
            retMsg: string;
            clientWording: string;
        };
    }>;
    setGroupRemark(groupCode: number, remark: string): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    createGroupFolder(groupCode: number, folderName: string, rootDirectory?: string): Promise<{
        readonly create: {
            retCode: bigint;
            retMsg: string;
            clientWording: string;
            folderInfo: {
                folderId: string;
                folderPath: string;
                folderName: string;
            };
        };
    }>;
    deleteGroupFolder(groupCode: number, folderId: string): Promise<{
        readonly delete: {
            retCode: bigint;
            retMsg: string;
            clientWording: string;
        };
    }>;
    renameGroupFolder(groupCode: number, folderId: string, newFolderName: string): Promise<{
        readonly rename: {
            retCode: bigint;
            retMsg: string;
            clientWording: string;
        };
    }>;
    setGroupPin(groupCode: number, isPinned: boolean): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    fetchGroup(groupCode: number): Promise<{
        readonly info: {
            groupCode: number;
            results: {
                ownerUid: string;
                groupCreateTime: number;
                maxMemberNum: number;
                memberNum: number;
                groupName: string;
                question: string;
                description: string | undefined;
                shutUpMeTimestamp: number;
                richGroupName: string | undefined;
            };
        };
    }>;
    fetchGroupMembers(groupCode: number, cookie?: Buffer): Promise<{
        readonly groupCode: number;
        readonly members: {
            id: {
                uid: string;
                uin: number;
            };
            memberName: string;
            memberCard: {
                memberCard: string | undefined;
            };
            level: {
                level: number | undefined;
            } | undefined;
            specialTitle: string | undefined;
            joinTimestamp: number;
            lastMsgTimestamp: number;
            shutUpTimestamp: number | undefined;
            permission: number | undefined;
        }[];
        readonly memberCount: number;
        readonly cookie: Buffer<ArrayBufferLike> | undefined;
    }>;
    kickGroupMember(groupCode: number, kickUids: string[], rejectSubsequentRequests: boolean, reason: string): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    muteGroupMember(groupCode: number, memList: {
        uid: string;
        duration: number;
    }[]): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    muteAllGroupMembers(groupCode: number, isMute: boolean): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    setGroupName(groupCode: number, name: string): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    setGroupMemberCard(groupCode: number, memberUid: string, card: string): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    setGroupMemberAdmin(groupCode: number, memberUid: string, isSet: boolean): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    leaveGroup(groupCode: number): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    handleGroupRequest(sequence: bigint, eventType: number, groupCode: number, operation: number, message?: string, filtered?: boolean): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    setGroupEssence(groupCode: number, msgSequence: number, msgRandom: number, isAdd: boolean): Promise<{
        readonly retMsg: string;
        readonly retCode: number;
    }>;
    setGroupReaction(groupCode: number, sequence: number, code: string, isAdd: boolean, type?: number): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    fetchGroupNotifies(count: number, filtered: boolean, startSequence?: bigint): Promise<{
        readonly requests: {
            sequence: bigint;
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
        readonly newLatestSequence: bigint | undefined;
    }>;
    getGroupRecommendContactArk(groupCode: number): Promise<{
        readonly ark: string;
    }>;
    setGroupMsgMask(groupCode: number, selfUid: string, msgMask: number): Promise<{
        readonly body: {
            groupCode: number;
            errCode: number;
        };
    }>;
    transGroupFile(groupCode: number, fileId: string): Promise<{
        readonly retCode: bigint;
        readonly retMsg: string;
        readonly clientWording: string;
    }>;
    fetchGroupAlbumList(groupCode: number): Promise<{
        readonly retCode: number;
        readonly retMsg: string;
        readonly body: {
            albums: {
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
        } | undefined;
    }>;
    renameGroupFile(groupCode: number, fileId: string, parentDirectory: string, newFileName: string, busId?: number): Promise<{
        readonly rename: {
            retCode: bigint;
            retMsg: string;
            clientWording: string;
        };
    }>;
    createGroupAlbum(groupCode: number, name: string, desc: string): Promise<{
        readonly requestId: number;
        readonly retCode: number;
        readonly retMsg: string;
        readonly body: {
            info: {
                albumId: string;
                groupCode: string;
                name: string;
                desc: string;
            };
        } | undefined;
    }>;
    deleteGroupAlbum(groupCode: number, albumId: string): Promise<{
        readonly retCode: number;
        readonly retMsg: string;
    }>;
    fetchGroupAlbumMediaList(groupCode: number, albumId: string, attachInfo?: string): Promise<{
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
    fetchGroupAtAllRemain(uin: number, groupCode: number): Promise<{
        readonly canAtAll: boolean;
        readonly remainAtAllCountForUin: number;
        readonly remainAtAllCountForGroup: number;
        readonly atTimesMsg: string;
        readonly canNotAtAllMsg: string | undefined;
    }>;
    fetchGroupExtra(groupCode: number): Promise<{
        readonly info: {
            groupCode: number;
            results: {
                latestMessageSeq: number;
            };
        };
    }>;
    forwardGroupFile(groupCode: number, dstUin: number, fileId: string, busId: number, toFriend: boolean): Promise<{
        readonly copyToRsp: {
            retCode: bigint;
            retMsg: string;
            clientWording: string;
            saveFilePath: string;
            busId: number;
            fileName: string;
        };
    }>;
}

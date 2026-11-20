import { ProtoMessage } from '@saltify/typeproto';
export declare namespace Oidb {
    const Base: ProtoMessage<{
        readonly command: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly subCommand: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly errorCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        readonly errorMsg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly isReserved: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0xed3_1 */
    const SendPokeReq: ProtoMessage<{
        readonly toUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly friendUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x8fc_2 */
    const SetSpecialTitleReq: ProtoMessage<{
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            targetUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            specialTitle: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            expireTime: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            uidName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
    }>;
    const GetRKeyResp: ProtoMessage<{
        readonly result: import("@saltify/typeproto").ProtoSpec<{
            rkeyItems: import("@saltify/typeproto").ProtoSpec<{
                rkey: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                ttlSec: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                storeId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                createTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, true>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0xfe1_2 */
    const FetchUserInfoByUinReq: ProtoMessage<{
        readonly uin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly keys: import("@saltify/typeproto").ProtoSpec<{
            key: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, true>;
    }>;
    /** OidbSvcTrpcTcp.0xfe1_2 - 通过 UID 查 stranger，返回里包含 UIN */
    const FetchUserInfoByUidReq: ProtoMessage<{
        readonly uid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly keys: import("@saltify/typeproto").ProtoSpec<{
            key: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, true>;
    }>;
    const FetchUserInfoResp: ProtoMessage<{
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            properties: import("@saltify/typeproto").ProtoSpec<{
                numberProperties: import("@saltify/typeproto").ProtoSpec<["uint32", "uint32"], false, false>;
                bytesProperties: import("@saltify/typeproto").ProtoSpec<["uint32", "bytes"], false, false>;
            }, false, false>;
            uin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0xfe7_3 */
    const FetchGroupMembersReq: ProtoMessage<{
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            memberName: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            memberCard: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            level: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            specialTitle: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            joinTimestamp: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            lastMsgTimestamp: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            shutUpTimestamp: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            permission: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
        }, false, false>;
        readonly cookie: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
    }>;
    const FetchGroupMembersResp: ProtoMessage<{
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly members: import("@saltify/typeproto").ProtoSpec<{
            id: import("@saltify/typeproto").ProtoSpec<{
                uid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                uin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
            memberName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            memberCard: import("@saltify/typeproto").ProtoSpec<{
                memberCard: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
            }, false, false>;
            level: import("@saltify/typeproto").ProtoSpec<{
                level: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            }, true, false>;
            specialTitle: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
            joinTimestamp: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            lastMsgTimestamp: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            shutUpTimestamp: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            permission: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        }, false, true>;
        readonly memberCount: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly cookie: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
    }>;
    /** OidbSvcTrpcTcp.0x929d_0 */
    const FetchAiCharacterListReq: ProtoMessage<{
        readonly groupId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly chatType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const FetchAiCharacterListResp: ProtoMessage<{
        readonly property: import("@saltify/typeproto").ProtoSpec<{
            type: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            characters: import("@saltify/typeproto").ProtoSpec<{
                characterId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                characterName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                previewUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, false, true>;
        }, false, true>;
    }>;
    /** OidbSvcTrpcTcp.0x929b_0 */
    const GetGroupGenerateAiRecordReq: ProtoMessage<{
        readonly groupId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly voiceId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly text: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly chatType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly clientMsgInfo: import("@saltify/typeproto").ProtoSpec<{
            msgRandom: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x6d6_2 */
    const GetGroupFileReq: ProtoMessage<{
        readonly download: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            appId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            busId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            fileId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
    }>;
    const GetGroupFileResp: ProtoMessage<{
        readonly download: import("@saltify/typeproto").ProtoSpec<{
            retCode: import("@saltify/typeproto").ProtoSpec<"int64", false, false>;
            clientWording: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            downloadDns: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            downloadUrl: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0xe37_1200 */
    const GetPrivateFileReq: ProtoMessage<{
        readonly subCommand: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            receiverUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            fileUuid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            fileHash: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            t2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
        readonly field101: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field102: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field200: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field99999: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
    }>;
    const GetPrivateFileResp: ProtoMessage<{
        readonly command: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly subCommand: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            retCode: import("@saltify/typeproto").ProtoSpec<"int64", false, false>;
            state: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            result: import("@saltify/typeproto").ProtoSpec<{
                extra: import("@saltify/typeproto").ProtoSpec<{
                    field100: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    download: import("@saltify/typeproto").ProtoSpec<{
                        downloadUrl: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        downloadDns: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    }, false, false>;
                }, false, false>;
            }, false, false>;
            metadata: import("@saltify/typeproto").ProtoSpec<{
                fileName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, false, false>;
        }, false, false>;
        readonly field50: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0xeb7_1 */
    const GroupClockInReq: ProtoMessage<{
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            uin: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            groupCode: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            appVersion: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x6d6_0 */
    const GroupFileReq: ProtoMessage<{
        readonly uploadFileReq: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            appId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            busId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            entrance: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            parentFolderId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            fileName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            localPath: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            fileSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            sha: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            sha3: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            md5: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            supportMultiUpload: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
        }, false, false>;
    }>;
    const GroupFileResp: ProtoMessage<{
        readonly uploadFileRsp: import("@saltify/typeproto").ProtoSpec<{
            retCode: import("@saltify/typeproto").ProtoSpec<"int64", false, false>;
            retMsg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            clientWording: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            uploadIp: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            serverDns: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            busId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            fileId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            checkKey: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            fileKey: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            fileExist: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            uploadIpLanV4: import("@saltify/typeproto").ProtoSpec<"string", false, true>;
            uploadIpLanV6: import("@saltify/typeproto").ProtoSpec<"string", false, true>;
            uploadPort: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x6d9_4 - 群文件 feeds（上传完后发布到群聊里） */
    const GroupFileFeedReq: ProtoMessage<{
        readonly feedsInfoReq: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            appId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            feedsInfoList: import("@saltify/typeproto").ProtoSpec<{
                busId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                fileId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                msgRandom: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                feedFlag: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, true>;
        }, false, false>;
    }>;
    const GroupFileFeedResp: ProtoMessage<{
        readonly feedsInfoRsp: import("@saltify/typeproto").ProtoSpec<{
            retCode: import("@saltify/typeproto").ProtoSpec<"int64", false, false>;
            retMsg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            clientWording: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            feedsResultList: import("@saltify/typeproto").ProtoSpec<{
                retCode: import("@saltify/typeproto").ProtoSpec<"int64", false, false>;
                detail: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                fileId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                busId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                deadTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                msgSeq: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, true>;
            svrBusyWaitTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0xe37_1700 */
    const OfflineFileUploadReq: ProtoMessage<{
        readonly command: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly seq: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        readonly upload: import("@saltify/typeproto").ProtoSpec<{
            senderUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            receiverUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            fileSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            fileName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            md510MCheckSum: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            sha1CheckSum: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            localPath: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            md5CheckSum: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            sha3CheckSum: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        }, false, false>;
        readonly businessId: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        readonly clientType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        readonly flagSupportMediaPlatform: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
    }>;
    const OfflineFileUploadResp: ProtoMessage<{
        readonly command: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly seq: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        readonly upload: import("@saltify/typeproto").ProtoSpec<{
            retCode: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            retMsg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            totalSpace: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            usedSpace: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            uploadedSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            uploadIp: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            uploadDomain: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            uploadPort: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            uuid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            uploadKey: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            fileExist: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            packSize: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            uploadIpList: import("@saltify/typeproto").ProtoSpec<"string", false, true>;
            uploadHttpsPort: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            uploadHttpsDomain: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            uploadDns: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            uploadLanip: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            fileIdCrc: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            rtpMediaPlatformUploadAddress: import("@saltify/typeproto").ProtoSpec<{
                outIp: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                outPort: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                innerIp: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                innerPort: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                ipType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, true>;
            mediaPlatformUploadKey: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        }, false, false>;
        readonly businessId: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        readonly clientType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        readonly flagSupportMediaPlatform: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0xfe5_2 */
    const FetchGroupsReq: ProtoMessage<{
        readonly config: import("@saltify/typeproto").ProtoSpec<{
            config1: import("@saltify/typeproto").ProtoSpec<{
                groupOwner: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                createdTime: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                memberMax: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                memberCount: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                groupName: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                topTime: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                groupShutupExpireTime: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                description: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                question: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                richDescription: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                announcement: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            }, false, false>;
            config2: import("@saltify/typeproto").ProtoSpec<{
                memberRole: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                remark: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                personShutupExpireTime: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                msgMask: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            }, false, false>;
        }, false, false>;
    }>;
    const FetchGroupsResp: ProtoMessage<{
        readonly groups: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            info: import("@saltify/typeproto").ProtoSpec<{
                groupOwner: import("@saltify/typeproto").ProtoSpec<{
                    uid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                }, false, false>;
                createdTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                memberMax: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                memberCount: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                groupName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                topTime: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                groupShutupExpireTime: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                description: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                question: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                richDescription: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                announcement: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
            }, false, false>;
            personInfo: import("@saltify/typeproto").ProtoSpec<{
                memberRole: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                remark: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                personShutupExpireTime: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                msgMask: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
        }, false, true>;
    }>;
    /** OidbSvcTrpcTcp.0x6d8_1 */
    const GetGroupFileListReq: ProtoMessage<{
        readonly listReq: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            appId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            targetDirectory: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            fileCount: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            sortBy: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            startIndex: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field17: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field18: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
    }>;
    const GetGroupFileListRespItem: ProtoMessage<{
        readonly type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly folderInfo: import("@saltify/typeproto").ProtoSpec<{
            folderId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            parentFolderId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            folderName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            createTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            modifyTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            createUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            creatorName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            totalFileCount: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            modifyUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            modifyName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            usedSpace: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, true, false>;
        readonly fileInfo: import("@saltify/typeproto").ProtoSpec<{
            fileId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            fileName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            fileSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            busId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            uploadedSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            uploadedTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            expireTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            modifiedTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            downloadedTimes: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            fileSha1: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            fileMd5: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            uploaderName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            uploaderUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            parentDirectory: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            field17: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field22: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, true, false>;
    }>;
    const GetGroupFileListResp: ProtoMessage<{
        readonly listResp: import("@saltify/typeproto").ProtoSpec<{
            retCode: import("@saltify/typeproto").ProtoSpec<"int64", false, false>;
            retMsg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            clientWording: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            isEnd: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            items: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                readonly type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly folderInfo: import("@saltify/typeproto").ProtoSpec<{
                    folderId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    parentFolderId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    folderName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    createTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    modifyTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    createUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    creatorName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    totalFileCount: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    modifyUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    modifyName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    usedSpace: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }, true, false>;
                readonly fileInfo: import("@saltify/typeproto").ProtoSpec<{
                    fileId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    fileName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    fileSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    busId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    uploadedSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    uploadedTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    expireTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    modifiedTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    downloadedTimes: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    fileSha1: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                    fileMd5: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                    uploaderName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    uploaderUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    parentDirectory: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    field17: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    field22: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                }, true, false>;
            }>, false, true>;
            allFileCount: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            nextIndex: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x6d8_2 */
    const GetGroupFileCountReq: ProtoMessage<{
        readonly countReq: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            appId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            busId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
    }>;
    const GetGroupFileCountResp: ProtoMessage<{
        readonly countResp: import("@saltify/typeproto").ProtoSpec<{
            fileCount: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            limitCount: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            isFull: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x6d8_3 */
    const GetGroupFileSpaceReq: ProtoMessage<{
        readonly spaceReq: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            appId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
    }>;
    const GetGroupFileSpaceResp: ProtoMessage<{
        readonly spaceResp: import("@saltify/typeproto").ProtoSpec<{
            totalSpace: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
            usedSpace: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0xe07_0 */
    const ImageOcrReq: ProtoMessage<{
        readonly version: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly client: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly entrance: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly ocrReqBody: import("@saltify/typeproto").ProtoSpec<{
            imageUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            languageType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            scene: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            originMd5: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            afterCompressMd5: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            afterCompressFileSize: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            afterCompressWeight: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            afterCompressHeight: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            isCut: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
        }, false, false>;
    }>;
    const ImageOcrResp: ProtoMessage<{
        readonly retCode: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
        readonly errMsg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly wording: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
        readonly ocrRspBody: import("@saltify/typeproto").ProtoSpec<{
            textDetections: import("@saltify/typeproto").ProtoSpec<{
                detectedText: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                confidence: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                polygon: import("@saltify/typeproto").ProtoSpec<{
                    coordinates: import("@saltify/typeproto").ProtoSpec<{
                        x: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        y: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                    }, false, true>;
                }, false, false>;
                advancedInfo: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, false, true>;
            language: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            requestId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            ocrLanguageList: import("@saltify/typeproto").ProtoSpec<"string", false, true>;
            dstTranslateLanguageList: import("@saltify/typeproto").ProtoSpec<"string", false, true>;
            languageList: import("@saltify/typeproto").ProtoSpec<{
                languageCode: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                languageDesc: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, false, true>;
            afterCompressWeight: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            afterCompressHeight: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0xb5d_44 */
    const SetFriendRequestReq: ProtoMessage<{
        readonly accept: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly targetUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0xd72_0 */
    const SetFilteredFriendRequestReq: ProtoMessage<{
        readonly selfUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly requestUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0xfd4_1 */
    const IncPullReq: ProtoMessage<{
        readonly reqCount: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly time: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly localSeq: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly cookie: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
        readonly flag: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        readonly proxySeq: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly requestBiz: import("@saltify/typeproto").ProtoSpec<{
            bizType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            bizData: import("@saltify/typeproto").ProtoSpec<{
                extBusi: import("@saltify/typeproto").ProtoSpec<"int32", false, true>;
            }, false, false>;
        }, false, true>;
        readonly extSnsFlagKey: import("@saltify/typeproto").ProtoSpec<"uint32", false, true>;
        readonly extPrivateIdListKey: import("@saltify/typeproto").ProtoSpec<"uint32", false, true>;
    }>;
    const IncPullResp: ProtoMessage<{
        readonly seq: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly cookie: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
        readonly isEnd: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
        readonly time: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly selfUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly smallSeq: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly friendList: import("@saltify/typeproto").ProtoSpec<{
            uid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            categoryId: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            uin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            subBiz: import("@saltify/typeproto").ProtoSpec<["int32", {
                numData: import("@saltify/typeproto").ProtoSpec<["int32", "int32"], false, false>;
                data: import("@saltify/typeproto").ProtoSpec<["int32", "bytes"], false, false>;
            }], false, false>;
        }, false, true>;
        readonly category: import("@saltify/typeproto").ProtoSpec<{
            categoryId: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            categoryName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            categoryMemberCount: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            categorySortId: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        }, false, true>;
    }>;
    const FetchPinsResp: ProtoMessage<{
        readonly friends: import("@saltify/typeproto").ProtoSpec<{
            uid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, true>;
        readonly groups: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, true>;
    }>;
    /** OidbSvcTrpcTcp.0x12b6_0 */
    const GetFriendRecommendContactArkReq: ProtoMessage<{
        readonly uin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly phoneNumber: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly jumpUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
    const GetFriendRecommendContactArkResp: ProtoMessage<{
        readonly ark: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x10cc_1 */
    const SetFriendRemarkReq: ProtoMessage<{
        readonly uid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly remark: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x126b_0 */
    const DeleteFriendReq: ProtoMessage<{
        readonly field1: import("@saltify/typeproto").ProtoSpec<{
            targetUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            field2: import("@saltify/typeproto").ProtoSpec<{
                field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field3: import("@saltify/typeproto").ProtoSpec<{
                    field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }, false, false>;
            }, false, false>;
            block: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            bothDelete: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x10eb_1 */
    const SetFriendCategoryReq: ProtoMessage<{
        readonly uid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly categoryId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x5cf_11 */
    const FetchFriendRequestsReq: ProtoMessage<{
        readonly version: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        readonly type: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        readonly selfUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly startIndex: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        readonly reqNum: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        readonly getFlag: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        readonly startTime: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        readonly needCommFriend: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        readonly field22: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
    }>;
    const FetchFriendRequestsResp: ProtoMessage<{
        readonly field1: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        readonly field2: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        readonly info: import("@saltify/typeproto").ProtoSpec<{
            field2: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            count: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            requests: import("@saltify/typeproto").ProtoSpec<{
                selfUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                friendUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                state: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                timestamp: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                comment: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                source: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                sourceId: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                subSourceId: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                isInitiator: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            }, false, true>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0xd69_0 */
    const FetchFilteredFriendRequestsReq: ProtoMessage<{
        readonly field1: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        readonly field2: import("@saltify/typeproto").ProtoSpec<{
            count: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        }, false, false>;
    }>;
    const FetchFilteredFriendRequestsResp: ProtoMessage<{
        readonly info: import("@saltify/typeproto").ProtoSpec<{
            requests: import("@saltify/typeproto").ProtoSpec<{
                sourceUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                sourceNickname: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                comment: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                source: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                warningInfo: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                timestamp: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, true>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x5d6_18 */
    const SetFriendPinReq: ProtoMessage<{
        readonly field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly info: import("@saltify/typeproto").ProtoSpec<{
            friendUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            field400: import("@saltify/typeproto").ProtoSpec<{
                field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                timestamp: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            }, false, false>;
        }, false, false>;
        readonly field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x5d6_1 */
    const SetGroupPinReq: ProtoMessage<{
        readonly field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly info: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field400: import("@saltify/typeproto").ProtoSpec<{
                field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                timestamp: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            }, false, false>;
        }, false, false>;
        readonly field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x88d_14 */
    const FetchGroupReq: ProtoMessage<{
        readonly random: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly config: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            flags: import("@saltify/typeproto").ProtoSpec<{
                ownerUid: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                groupCreateTime: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                maxMemberNum: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                memberNum: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                groupName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                question: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                description: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                shutUpMeTimestamp: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                richGroupName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, false, false>;
        }, false, false>;
    }>;
    const FetchGroupResp: ProtoMessage<{
        readonly info: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            results: import("@saltify/typeproto").ProtoSpec<{
                ownerUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                groupCreateTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                maxMemberNum: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                memberNum: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                groupName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                question: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                description: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                shutUpMeTimestamp: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                richGroupName: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
            }, false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x8a0_1 */
    const KickMemberReq: ProtoMessage<{
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly kickUids: import("@saltify/typeproto").ProtoSpec<"string", false, true>;
        readonly rejectSubsequentRequests: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
        readonly reason: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
    }>;
    /** OidbSvcTrpcTcp.0x1253_1 */
    const MuteMemberReq: ProtoMessage<{
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly memCount: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly memList: import("@saltify/typeproto").ProtoSpec<{
            uid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            duration: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, true>;
    }>;
    /** OidbSvcTrpcTcp.0x89a_0 */
    const MuteAllMembersReq: ProtoMessage<{
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            duration: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x89a_15 */
    const SetGroupNameReq: ProtoMessage<{
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            name: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x8fc_3 */
    const SetMemberCardReq: ProtoMessage<{
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            targetUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            card: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, true>;
    }>;
    /** OidbSvcTrpcTcp.0x1097_1 */
    const LeaveGroupReq: ProtoMessage<{
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x10c8_1 / 0x10c8_2 */
    const HandleGroupRequestReq: ProtoMessage<{
        readonly operation: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            sequence: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
            eventType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            message: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x1096_1 */
    const SetMemberAdminReq: ProtoMessage<{
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly memberUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly isSet: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0xeac_1 / 0xeac_2 */
    const GroupEssenceReq: ProtoMessage<{
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly msgSequence: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly msgRandom: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const GroupEssenceResp: ProtoMessage<{
        readonly retMsg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly retCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x9082_1 / 0x9082_2 */
    const GroupReactionReq: ProtoMessage<{
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly sequence: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly code: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x102a_0 (PSkey) / 0x102a_1 (clientKey) */
    const FetchCookiesReq: ProtoMessage<{
        readonly domain: import("@saltify/typeproto").ProtoSpec<"string", false, true>;
    }>;
    const FetchCookiesResp: ProtoMessage<{
        readonly psKeys: import("@saltify/typeproto").ProtoSpec<["string", "string"], false, false>;
        readonly keyType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        readonly clientKey: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly expiration: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x10c0_1 / 0x10c0_2 */
    const FetchGroupNotifiesReq: ProtoMessage<{
        readonly count: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly startSequence: import("@saltify/typeproto").ProtoSpec<"uint64", true, false>;
    }>;
    const FetchGroupNotifiesResp: ProtoMessage<{
        readonly requests: import("@saltify/typeproto").ProtoSpec<{
            sequence: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
            type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            requestState: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            group: import("@saltify/typeproto").ProtoSpec<{
                groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                groupName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, false, false>;
            user1: import("@saltify/typeproto").ProtoSpec<{
                uid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                nickName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, false, false>;
            user2: import("@saltify/typeproto").ProtoSpec<{
                uid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                nickName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, true, false>;
            user3: import("@saltify/typeproto").ProtoSpec<{
                uid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                nickName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, true, false>;
            time: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            comment: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
        }, false, true>;
        readonly newLatestSequence: import("@saltify/typeproto").ProtoSpec<"uint64", true, false>;
    }>;
    /** OidbSvcTrpcTcp.0x7e5_104 */
    const FriendLikeReq: ProtoMessage<{
        readonly targetUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly count: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x6d6_3 */
    const GroupFileDeleteReq: ProtoMessage<{
        readonly delete: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            busId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            fileId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
    }>;
    const GroupFileDeleteResp: ProtoMessage<{
        readonly delete: import("@saltify/typeproto").ProtoSpec<{
            retCode: import("@saltify/typeproto").ProtoSpec<"int64", false, false>;
            retMsg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            clientWording: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x6d6_5 */
    const GroupFileMoveReq: ProtoMessage<{
        readonly move: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            appId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            busId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            fileId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            parentDirectory: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            targetDirectory: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
    }>;
    const GroupFileMoveResp: ProtoMessage<{
        readonly move: import("@saltify/typeproto").ProtoSpec<{
            retCode: import("@saltify/typeproto").ProtoSpec<"int64", false, false>;
            retMsg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            clientWording: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0xf16_1 */
    const GroupRemarkReq: ProtoMessage<{
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            targetRemark: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x6d7_0 */
    const GroupFolderCreateReq: ProtoMessage<{
        readonly create: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            rootDirectory: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            folderName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
    }>;
    const GroupFolderCreateResp: ProtoMessage<{
        readonly create: import("@saltify/typeproto").ProtoSpec<{
            retCode: import("@saltify/typeproto").ProtoSpec<"int64", false, false>;
            retMsg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            clientWording: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            folderInfo: import("@saltify/typeproto").ProtoSpec<{
                folderId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                folderPath: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                folderName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x6d7_1 */
    const GroupFolderDeleteReq: ProtoMessage<{
        readonly delete: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            folderId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
    }>;
    const GroupFolderDeleteResp: ProtoMessage<{
        readonly delete: import("@saltify/typeproto").ProtoSpec<{
            retCode: import("@saltify/typeproto").ProtoSpec<"int64", false, false>;
            retMsg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            clientWording: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x6d7_2 */
    const GroupFolderRenameReq: ProtoMessage<{
        readonly rename: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            folderId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            newFolderName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
    }>;
    const GroupFolderRenameResp: ProtoMessage<{
        readonly rename: import("@saltify/typeproto").ProtoSpec<{
            retCode: import("@saltify/typeproto").ProtoSpec<"int64", false, false>;
            retMsg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            clientWording: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x8b7_5 */
    const GetGroupRecommendContactArkReq: ProtoMessage<{
        readonly field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field5: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const GetGroupRecommendContactArkResp: ProtoMessage<{
        readonly ark: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0xa80_1 */
    const SetGroupMsgMaskReq: ProtoMessage<{
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            setting: import("@saltify/typeproto").ProtoSpec<{
                selfUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                msgMask: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
            field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field4: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
    }>;
    const SetGroupMsgMaskResp: ProtoMessage<{
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            errCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x6d9_0 */
    const TransGroupFileReq: ProtoMessage<{
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            busId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            fileId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
    }>;
    const TransGroupFileResp: ProtoMessage<{
        readonly retCode: import("@saltify/typeproto").ProtoSpec<"int64", false, false>;
        readonly retMsg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly clientWording: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x7ed_13 */
    const FetchProfileLikeReq: ProtoMessage<{
        readonly selfUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field4: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field101: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly start: import("@saltify/typeproto").ProtoSpec<"int64", false, false>;
        readonly count: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const FetchProfileLikeResp: ProtoMessage<{
        readonly userLikeInfo: import("@saltify/typeproto").ProtoSpec<{
            targetUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            favoriteInfo: import("@saltify/typeproto").ProtoSpec<{
                users: import("@saltify/typeproto").ProtoSpec<{
                    uid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    src: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    latestTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    count: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    giftCount: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    customId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    lastCharged: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    bTodayVotedCnt: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    nick: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    gender: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    age: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    isvip: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                    isSvip: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                }, false, true>;
            }, false, false>;
            voteInfo: import("@saltify/typeproto").ProtoSpec<{
                totalCount: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                users: import("@saltify/typeproto").ProtoSpec<{
                    uid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    src: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    latestTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    count: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    giftCount: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    customId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    lastCharged: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    bTodayVotedCnt: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    nick: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    gender: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    age: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    isvip: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                    isSvip: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                }, false, true>;
            }, false, false>;
        }, false, false>;
        readonly start: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x7ed_12 */
    const FetchProfileLikeCountReq: ProtoMessage<{
        readonly uid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
    const FetchProfileLikeCountResp: ProtoMessage<{
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            voteInfo: import("@saltify/typeproto").ProtoSpec<{
                totalCount: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x6d6_4 */
    const RenameGroupFileReq: ProtoMessage<{
        readonly rename: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            busId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            fileId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            parentDirectory: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            newFileName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
    }>;
    const RenameGroupFileResp: ProtoMessage<{
        readonly rename: import("@saltify/typeproto").ProtoSpec<{
            retCode: import("@saltify/typeproto").ProtoSpec<"int64", false, false>;
            retMsg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            clientWording: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x112a_2 */
    const ModifySelfProfileReq: ProtoMessage<{
        readonly selfUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly bytesProperties: import("@saltify/typeproto").ProtoSpec<{
            key: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            value: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        }, false, true>;
        readonly numberProperties: import("@saltify/typeproto").ProtoSpec<{
            key: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            value: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, true>;
    }>;
    /** OidbSvcTrpcTcp.0x9083_1 */
    const FetchEmojiLikesReq: ProtoMessage<{
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly msgSeq: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly chatType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly emojiCode: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly cookie: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly field7: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly count: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const FetchEmojiLikesResp: ProtoMessage<{
        readonly users: import("@saltify/typeproto").ProtoSpec<{
            uin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, true>;
        readonly cookie: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly isLastPage: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
        readonly isFirstPage: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x93eb_1 */
    const FlashFileSetIdByCodeReq: ProtoMessage<{
        readonly code: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
    const FlashFileSetIdByCodeResp: ProtoMessage<{
        readonly fileSetId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x93d3_1 */
    const FlashFileInfoReq: ProtoMessage<{
        readonly fileSetId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const FlashFileInfoResp: ProtoMessage<{
        readonly info: import("@saltify/typeproto").ProtoSpec<{
            fileSetId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            title: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            subtitle: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            field4: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            totalSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            shareInfo: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                readonly url: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }>, true, false>;
            field11: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            createTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            expireTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, true, false>;
    }>;
    /** OidbSvcTrpcTcp.0x93d4_1 */
    const FlashFileListReq: ProtoMessage<{
        readonly fileSetId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly paging: import("@saltify/typeproto").ProtoSpec<{
            cookie: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            count: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field4: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            flags1: import("@saltify/typeproto").ProtoSpec<{
                field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
            flags2: import("@saltify/typeproto").ProtoSpec<{
                field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
        }, false, false>;
        readonly field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field4: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const FlashFileListResp: ProtoMessage<{
        readonly result: import("@saltify/typeproto").ProtoSpec<{
            field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            files: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                readonly fileSetId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly fileUuid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly field5: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly field6: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly fileTypeFlag: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly name: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly name2: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly fileSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly downloadToken: import("@saltify/typeproto").ProtoSpec<{
                    token: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    tokenWithKind: import("@saltify/typeproto").ProtoSpec<{
                        kind: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        token: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    }, false, false>;
                    sha1Hex: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    field4: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    md5Hex: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    field6: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    field7: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }, true, false>;
                readonly historyToken: import("@saltify/typeproto").ProtoSpec<{
                    token: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }, true, false>;
                readonly fileUuid2: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly field18: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly sha1Hex: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly fileSize2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly md5Hex: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }>, false, true>;
        }, true, false>;
    }>;
    /** OidbSvcTrpcTcp.0x93e5_4, 自己的 fileSet 也返回 sha1 / md5 / historyToken (list 不返回) */
    const FlashFileGetFileInfoReq: ProtoMessage<{
        readonly fileUuid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly fileSetId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const FlashFileGetFileInfoResp: ProtoMessage<{
        readonly wrap: import("@saltify/typeproto").ProtoSpec<{
            fileUuid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            file: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                readonly fileSetId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly fileUuid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly field5: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly field6: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly fileTypeFlag: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly name: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly name2: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly fileSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly downloadToken: import("@saltify/typeproto").ProtoSpec<{
                    token: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    tokenWithKind: import("@saltify/typeproto").ProtoSpec<{
                        kind: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        token: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    }, false, false>;
                    sha1Hex: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    field4: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    md5Hex: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    field6: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    field7: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }, true, false>;
                readonly historyToken: import("@saltify/typeproto").ProtoSpec<{
                    token: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }, true, false>;
                readonly fileUuid2: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly field18: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly sha1Hex: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly fileSize2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly md5Hex: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }>, true, false>;
        }, true, false>;
    }>;
    /** OidbSvcTrpcTcp.0x93d1_1, sceneType=6 时用于上传完 finalize */
    const FlashFileDownloadReq: ProtoMessage<{
        readonly fileSetId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly sceneType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x93cf_1 */
    const CreateFlashFileSetReq: ProtoMessage<{
        readonly totalFileCount: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly meta: import("@saltify/typeproto").ProtoSpec<{
            title: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            subtitle: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            field4: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            totalFileSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            uploader: import("@saltify/typeproto").ProtoSpec<{
                uin: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                nickname: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                uid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                field4: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            }, false, false>;
            field16: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field20: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field21: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field23: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field24: import("@saltify/typeproto").ProtoSpec<{
                field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field3: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            }, true, false>;
        }, false, false>;
        readonly field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field12: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const CreateFlashFileSetResp: ProtoMessage<{
        readonly fileSetId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly fileSetIdEcho: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly shareLink: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly expireTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly expireLeftTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x93d0_1 */
    const RegisterFlashFileReq: ProtoMessage<{
        readonly field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly fileSetId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly fileSetIdEcho: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly file: import("@saltify/typeproto").ProtoSpec<{
            fileSetId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            fileUuid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field4: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            field5: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field6: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field7: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            name: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            name2: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            field10: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            fileSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field12: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            sha1Hex: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
            field24: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            md5Hex: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
        }, false, false>;
        readonly field5: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field6: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x93db_1, 在 12a9 上传前调 */
    const PrepFlashFileSetReq: ProtoMessage<{
        readonly fileSetId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly field2: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x12a9_100, NTV2RichMedia 的格式, sceneType=5 businessType=4 */
    const FlashFileUploadPreReq: ProtoMessage<{
        readonly head: import("@saltify/typeproto").ProtoSpec<{
            common: import("@saltify/typeproto").ProtoSpec<{
                requestId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                command: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
            scene: import("@saltify/typeproto").ProtoSpec<{
                requestType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                businessType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field103: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                sceneType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
            client: import("@saltify/typeproto").ProtoSpec<{
                agentType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
        }, false, false>;
        readonly upload: import("@saltify/typeproto").ProtoSpec<{
            uploadInfo: import("@saltify/typeproto").ProtoSpec<{
                fileInfo: import("@saltify/typeproto").ProtoSpec<{
                    fileSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    md5: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                    sha1: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    name: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    fileType: import("@saltify/typeproto").ProtoSpec<{
                        field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        field4: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    }, false, false>;
                    width: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    height: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    field8: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    field9: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }, false, false>;
                subFileType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
            tryFastUploadCompleted: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            srvSendMsg: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            clientRandomId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            compatQMsgSceneType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            extBizInfo: import("@saltify/typeproto").ProtoSpec<{
                field1: import("@saltify/typeproto").ProtoSpec<{
                    field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    field2: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                }, false, false>;
                field2: import("@saltify/typeproto").ProtoSpec<{
                    field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }, true, false>;
            }, false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0x12a9_103 */
    const FlashFileUploadCommitReq: ProtoMessage<{
        readonly head: import("@saltify/typeproto").ProtoSpec<{
            common: import("@saltify/typeproto").ProtoSpec<{
                requestId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                command: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
            scene: import("@saltify/typeproto").ProtoSpec<{
                requestType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                businessType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field103: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                sceneType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
            client: import("@saltify/typeproto").ProtoSpec<{
                agentType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
        }, false, false>;
        readonly commit: import("@saltify/typeproto").ProtoSpec<{
            fileSummary: import("@saltify/typeproto").ProtoSpec<{
                fileInfo: import("@saltify/typeproto").ProtoSpec<{
                    fileSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    md5: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                    sha1: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    name: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    fileType: import("@saltify/typeproto").ProtoSpec<{
                        field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        field4: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    }, false, false>;
                    width: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    height: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    field8: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    field9: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }, false, false>;
                token: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                time: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                ttl: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field6: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
            field2: import("@saltify/typeproto").ProtoSpec<{
                field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
            field3: import("@saltify/typeproto").ProtoSpec<{
                field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
            target: import("@saltify/typeproto").ProtoSpec<{
                fileSetId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                fileSetId2: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                fileUuid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                field4: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field5: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field6: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                fileTypeFlag: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field8: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                field9: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field10: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field11: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field12: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field13: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field14: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
        }, false, false>;
    }>;
    /** 0x12a9_100 / 0x12a9_103 共用 */
    const FlashFileUploadResp: ProtoMessage<{
        readonly head: import("@saltify/typeproto").ProtoSpec<{
            common: import("@saltify/typeproto").ProtoSpec<{
                requestId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                command: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
            retCode: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
        }, false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            uKey: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
            uKeyTtlSecond: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            fastUploadInfo: import("@saltify/typeproto").ProtoSpec<{
                summary: import("@saltify/typeproto").ProtoSpec<{
                    fileSummary: import("@saltify/typeproto").ProtoSpec<{
                        fileInfo: import("@saltify/typeproto").ProtoSpec<{
                            fileSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            sha1: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            name: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            md5: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                            width: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            height: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            field9: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        }, false, false>;
                        token: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        time: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        ttl: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        field7: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    }, false, false>;
                    field5: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }, false, false>;
            }, true, false>;
        }, true, false>;
        readonly commitInfo: import("@saltify/typeproto").ProtoSpec<{
            summary: import("@saltify/typeproto").ProtoSpec<{
                token: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                time: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                ttl: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, true, false>;
        }, true, false>;
    }>;
    /** OidbSvcTrpcTcp.0x12a9_200, 跟 0x12a9_100 / 103 是同一个 NTV2RichMedia 服务, command=200 是下载 */
    const FlashFileDownloadPreReq: ProtoMessage<{
        readonly head: import("@saltify/typeproto").ProtoSpec<{
            common: import("@saltify/typeproto").ProtoSpec<{
                requestId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                command: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
            scene: import("@saltify/typeproto").ProtoSpec<{
                requestType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                businessType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field103: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                sceneType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
            client: import("@saltify/typeproto").ProtoSpec<{
                agentType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
        }, false, false>;
        readonly download: import("@saltify/typeproto").ProtoSpec<{
            info: import("@saltify/typeproto").ProtoSpec<{
                fileInfo: import("@saltify/typeproto").ProtoSpec<{
                    fileSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    md5: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                    sha1: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                    name: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    fileType: import("@saltify/typeproto").ProtoSpec<{
                        field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        field4: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    }, false, false>;
                    width: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    height: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    field8: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    field9: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }, false, false>;
                fileId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field4: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field5: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field6: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
            clientCaps: import("@saltify/typeproto").ProtoSpec<{
                capsBody: import("@saltify/typeproto").ProtoSpec<{
                    field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    field5: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    field6: import("@saltify/typeproto").ProtoSpec<{
                        field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        field2: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        field3: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        field4: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    }, false, false>;
                }, false, false>;
                smallFlag: import("@saltify/typeproto").ProtoSpec<{
                    field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }, false, false>;
                target: import("@saltify/typeproto").ProtoSpec<{
                    fileSetId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    fileUuid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    fileUuid2: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                }, false, false>;
            }, false, false>;
            field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
    }>;
    const FlashFileDownloadPreResp: ProtoMessage<{
        readonly head: import("@saltify/typeproto").ProtoSpec<{
            common: import("@saltify/typeproto").ProtoSpec<{
                requestId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                command: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
            retCode: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
        }, false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            rkey: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            ttl: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            url: import("@saltify/typeproto").ProtoSpec<{
                host: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                path: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                port: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
        }, true, false>;
    }>;
    /** OidbSvcTrpcTcp.0x8a7_0 */
    const FetchGroupAtAllRemainReq: ProtoMessage<{
        readonly subCmd: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly limitIntervalTypeForUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly limitIntervalTypeForGroup: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly uin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const FetchGroupAtAllRemainResp: ProtoMessage<{
        readonly canAtAll: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
        readonly remainAtAllCountForUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly remainAtAllCountForGroup: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly atTimesMsg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly canNotAtAllMsg: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
    }>;
    /** OidbSvcTrpcTcp.0x88d_0 */
    const FetchGroupExtraReq: ProtoMessage<{
        readonly random: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly config: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            flags: import("@saltify/typeproto").ProtoSpec<{
                latestMessageSeq: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            }, false, false>;
        }, false, false>;
    }>;
    const FetchGroupExtraResp: ProtoMessage<{
        readonly info: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            results: import("@saltify/typeproto").ProtoSpec<{
                latestMessageSeq: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
        }, false, false>;
    }>;
    /** OidbSvcTrpcTcp.0xcd4_1 */
    const SetInputStatusReq: ProtoMessage<{
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            toUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            eventType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
    }>;
    const SetInputStatusResp: ProtoMessage<{
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            retCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
    }>;
    const GetFriendsStatusReq: ProtoMessage<{
        readonly selfUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly field5: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field7: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field100: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field101: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const GetFriendsStatusResp: ProtoMessage<{
        readonly list: import("@saltify/typeproto").ProtoSpec<{
            uid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            status: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, true>;
    }>;
    const ForwardGroupFileReq: ProtoMessage<{
        readonly copyToReq: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            appId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            srcBusId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            srcFileId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            dstBusId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            dstUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            newFileName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            timCloudPdirKey: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            timCloudPpdirKey: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            timCloudExtensionInfo: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            timFileExistOption: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
    }>;
    const ForwardGroupFileResp: ProtoMessage<{
        readonly copyToRsp: import("@saltify/typeproto").ProtoSpec<{
            retCode: import("@saltify/typeproto").ProtoSpec<"int64", false, false>;
            retMsg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            clientWording: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            saveFilePath: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            busId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            fileName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
    }>;
}

import { Msg } from '../../ntqqapi/proto';
import { InferProtoModelInput } from '@saltify/typeproto';
import type { QQProtocolBase } from '../base';
export declare function MessageMixin<T extends abstract new (...args: any[]) => QQProtocolBase>(Base: T): T & (abstract new (...args: any[]) => MessageMixinMethods);
/** Public methods contributed by this protocol mixin. */
export interface MessageMixinMethods {
    uploadForward(peerUid: string, isGroup: boolean, items: InferProtoModelInput<typeof Msg.PbMultiMsgItem>[]): Promise<{
        readonly result: {
            resId: string;
        };
        readonly settings: {
            readonly field1: number;
            readonly field2: number;
            readonly field3: number;
            readonly field4: number;
        };
    }>;
    getMultiMsg(resId: string): Promise<{
        readonly msg: {
            readonly routingHead: {
                fromUin: number;
                fromUid: string;
                fromAppid: number;
                fromInstid: number;
                toUin: number;
                toUid: string;
                c2c: {
                    c2cType: number;
                    serviceType: number;
                    sig: Buffer<ArrayBufferLike> | undefined;
                    fromTinyId: number;
                    toTinyId: number;
                    name: string;
                };
                group: {
                    groupCode: number;
                    groupType: number;
                    groupInfoSeq: bigint;
                    groupCard: string;
                    groupCardType: number;
                    groupLevel: number;
                    groupName: string;
                    extGroupKeyInfo: string;
                    msgFlag: number;
                } | undefined;
            };
            readonly contentHead: {
                msgType: number;
                subType: number;
                c2cCmd: number;
                random: number;
                groupMsgSeqOrC2cClientSeq: number;
                msgTime: number;
                pkgNum: number;
                pkgIndex: number;
                divSeq: number;
                autoReply: number;
                c2cMsgSeq: number;
                msgUid: bigint;
                msgUidAlt: bigint | undefined;
                forward: {
                    field1: number;
                    field2: number;
                    field3: number;
                    field4: string;
                    avatar: string;
                } | undefined;
            };
            readonly body: {
                richText: {
                    attr: {
                        codePage: number;
                        time: number;
                        random: number;
                        color: number;
                        size: number;
                        effect: number;
                        charSet: number;
                        pitchAndFamily: number;
                        fontName: string;
                        reserveData: Buffer<ArrayBufferLike>;
                    };
                    elems: {
                        readonly text: {
                            str: string;
                            link: string | undefined;
                            attr6Buf: Buffer<ArrayBufferLike> | undefined;
                            attr7Buf: Buffer<ArrayBufferLike> | undefined;
                            buf: Buffer<ArrayBufferLike> | undefined;
                            pbReserve: Buffer<ArrayBufferLike> | undefined;
                        } | undefined;
                        readonly face: {
                            index: number;
                            old: Buffer<ArrayBufferLike>;
                            buf: Buffer<ArrayBufferLike> | undefined;
                        } | undefined;
                        readonly notOnlineImage: {
                            filePath: string;
                            fileLen: number;
                            downloadPath: Buffer<ArrayBufferLike>;
                            oldVerSendFile: Buffer<ArrayBufferLike>;
                            imgType: number;
                            previewsImage: Buffer<ArrayBufferLike>;
                            picMd5: Buffer<ArrayBufferLike>;
                            picHeight: number;
                            picWidth: number;
                            resId: string;
                            flag: Buffer<ArrayBufferLike>;
                            thumbUrl: string;
                            original: number;
                            bigUrl: string;
                            origUrl: string;
                            bizType: number;
                            result: number;
                            index: number;
                            opFaceBuf: Buffer<ArrayBufferLike>;
                            oldPicMd5: boolean;
                            thumbWidth: number;
                            thumbHeight: number;
                            fileId: number;
                            showLen: number;
                            downloadLen: number;
                            url400: string;
                            width400: number;
                            height400: number;
                            pbReserve: Buffer<ArrayBufferLike>;
                        } | undefined;
                        readonly transElemInfo: {
                            elemType: number;
                            elemValue: Buffer<ArrayBufferLike>;
                        } | undefined;
                        readonly marketFace: {
                            summary: string | undefined;
                            itemType: number | undefined;
                            info: number | undefined;
                            faceId: Buffer<ArrayBufferLike> | undefined;
                            tabId: number | undefined;
                            subType: number | undefined;
                            key: string | undefined;
                            width: number | undefined;
                            height: number | undefined;
                        } | undefined;
                        readonly customFace: {
                            guid: Buffer<ArrayBufferLike>;
                            filePath: string;
                            shortcut: string;
                            buffer: Buffer<ArrayBufferLike>;
                            flag: Buffer<ArrayBufferLike>;
                            oldData: Buffer<ArrayBufferLike> | undefined;
                            fileId: number;
                            serverIp: number | undefined;
                            serverPort: number | undefined;
                            fileType: number;
                            signature: Buffer<ArrayBufferLike>;
                            useful: number;
                            md5: Buffer<ArrayBufferLike>;
                            thumbUrl: string;
                            bigUrl: string;
                            origUrl: string;
                            bizType: number;
                            repeatIndex: number;
                            repeatImage: number;
                            imageType: number;
                            index: number;
                            width: number;
                            height: number;
                            source: number;
                            size: number;
                            origin: number;
                            thumbWidth: number | undefined;
                            thumbHeight: number | undefined;
                            showLen: number;
                            downloadLen: number;
                            x400Url: string | undefined;
                            x400Width: number;
                            x400Height: number;
                            pbReserve: {
                                subType: number;
                                field3: number;
                                field4: number;
                                summary: string;
                                field10: number;
                                field21: {
                                    field1: number;
                                    field2: string;
                                    field3: number;
                                    field4: number;
                                    field5: number;
                                    md5Str: string;
                                };
                                field31: string;
                            } | undefined;
                        } | undefined;
                        readonly elemFlags2: {
                            colorTextId: bigint;
                            msgId: bigint;
                            whisperSessionId: number;
                            pttChangeBit: number;
                            vipStatus: number;
                            compatibleId: number;
                            insts: {
                                appId: number;
                                instId: number;
                            }[];
                            msgRptCnt: number;
                            srcInst: {
                                appId: number;
                                instId: number;
                            };
                            longtitude: number;
                            latitude: number;
                            customFont: number;
                            pcSupportDef: {
                                pcPtlBegin: number;
                                pcPtlEnd: number;
                                macPtlBegin: number;
                                macPtlEnd: number;
                                ptlsSupport: number[];
                                ptlsNotSupport: number[];
                            };
                            crmFlags: number | undefined;
                        } | undefined;
                        readonly richMsg: {
                            template: Buffer<ArrayBufferLike>;
                            serviceId: number;
                        } | undefined;
                        readonly groupFile: {
                            filename: string | undefined;
                            fileSize: bigint | undefined;
                            fileId: Buffer<ArrayBufferLike> | undefined;
                            batchId: Buffer<ArrayBufferLike> | undefined;
                            fileKey: Buffer<ArrayBufferLike> | undefined;
                            sequence: bigint | undefined;
                        } | undefined;
                        readonly extraInfo: {
                            nick: string | undefined;
                            groupCard: string | undefined;
                            level: number;
                            flags: number;
                            groupMask: number;
                            msgTailId: number | undefined;
                            senderTitle: string;
                            apnsTips: string | undefined;
                            uin: number | undefined;
                            msgStateFlag: number | undefined;
                            apnsSoundType: number | undefined;
                            newGroupFlag: number | undefined;
                        } | undefined;
                        readonly videoFile: Buffer<ArrayBufferLike> | undefined;
                        readonly generalFlags: {
                            bubbleDiyTextId: number;
                            groupFlagNew: number;
                            uin: bigint;
                            rpId: Buffer<ArrayBufferLike>;
                            prpFold: number;
                            longTextFlag: number;
                            longTextResId: string | undefined;
                            groupType: number;
                            toUinFlag: number;
                            glamourLevel: number;
                            memberLevel: number;
                            groupRankSeq: bigint;
                            olympicTorch: number;
                            babyqGuideMsgCookie: Buffer<ArrayBufferLike>;
                            uin32ExpertFlag: number;
                            bubbleSubId: number;
                            pendantId: bigint;
                            rpIndex: Buffer<ArrayBufferLike>;
                            pbReserve: Buffer<ArrayBufferLike>;
                        } | undefined;
                        readonly srcMsg: {
                            origSeqs: number[];
                            senderUin: number;
                            time: number;
                            elems: Buffer<ArrayBufferLike>[];
                            attr: {
                                oriMsgType: number | undefined;
                                sourceMsgId: bigint;
                                senderUid: string;
                                receiverUid: string | undefined;
                                ntMsgSeq: number | undefined;
                            };
                            srcMsg: Buffer<ArrayBufferLike> | undefined;
                            toUin: number;
                        } | undefined;
                        readonly lightApp: {
                            data: Buffer<ArrayBufferLike>;
                            msgResid: Buffer<ArrayBufferLike> | undefined;
                        } | undefined;
                        readonly commonElem: {
                            serviceType: number;
                            pbElem: Buffer<ArrayBufferLike>;
                            businessType: number;
                        } | undefined;
                    }[];
                };
                msgContent: Buffer<ArrayBufferLike>;
                msgEncryptContent: Buffer<ArrayBufferLike>;
            } | undefined;
        }[];
        readonly pbItemList: {
            readonly fileName: string;
            readonly buffer: {
                msg: Buffer<ArrayBufferLike>[];
            };
        }[];
    }>;
    pullPics(word: string): Promise<{
        readonly info: {
            url: string;
        }[];
    }>;
    fetchAiCharacterList(groupId: number, chatType: number): Promise<{
        readonly property: {
            type: string;
            characters: {
                characterId: string;
                characterName: string;
                previewUrl: string;
            }[];
        }[];
    }>;
    getGroupGenerateAiRecord(groupId: number, character: string, text: string, chatType: number): Promise<{
        msgRandom: number;
    }>;
    getGroupMessages(groupCode: number, startSequence: number, endSequence: number): Promise<{
        readonly retcode: number;
        readonly errorMsg: string | undefined;
        readonly body: {
            groupCode: number;
            startSequence: number;
            endSequence: number;
            messages: Buffer<ArrayBufferLike>[];
        };
    }>;
    getC2CMessages(peerUid: string, startSequence: number, endSequence: number): Promise<{
        readonly retcode: number;
        readonly errorMsg: string | undefined;
        readonly messages: Buffer<ArrayBufferLike>[];
    }>;
    getC2CRoamMessages(peerUid: string, time: number, count: number, direction?: 1 | 2): Promise<{
        readonly peerUid: string | undefined;
        readonly isComplete: boolean | undefined;
        readonly timestamp: number | undefined;
        readonly random: number | undefined;
        readonly messages: Buffer<ArrayBufferLike>[];
    }>;
    recallGroupMessage(groupCode: number, sequence: number): Promise<void>;
    pttTransGroupReq(opts: {
        msgUid: bigint;
        senderUin: number;
        groupUin: number;
        voiceMd5Hex: string;
        voiceFileId: string;
    }): Promise<void>;
    pttTransC2CReq(opts: {
        msgUid: bigint;
        senderUin: number;
        receiverUin: number;
        voiceMd5Hex: string;
        voiceFileId: string;
    }): Promise<void>;
    listFavEmojis(): Promise<{
        readonly retCode: number;
        readonly errMsg: string;
        readonly subCmd: number;
        readonly userInfo: {
            fileName: string[];
            deleteFile: string[];
            bid: string;
            maxRoamSize: number;
        };
        readonly emojiType: number[];
    }>;
    deleteFavEmojis(emojiIds: string[]): Promise<{
        readonly retCode: number;
        readonly errMsg: string;
        readonly subCmd: number;
        readonly results: {
            emojiId: string;
            status: number;
        }[];
    }>;
    addFavEmojiPrep(opts: {
        md5: Buffer;
        fileSize: number;
    }): Promise<{
        readonly field1: bigint;
        readonly field2: number;
        readonly body: {
            retCode: number;
            field2: number;
            field4: number;
            uploadIps: number[];
            uploadPorts: number[];
            uKey: Buffer<ArrayBufferLike> | undefined;
            field9: number | undefined;
            field10: number | undefined;
            field11: number | undefined;
            field12: number | undefined;
            ext: {
                domain: string;
                path1: string | undefined;
                path2: string | undefined;
                emojiId: string;
            } | undefined;
        };
    }>;
    recallC2CMessage(targetUid: string, clientSequence: number, random: number, timestamp: number, c2cMsgSeq: number): Promise<void>;
    sendMessage(opts: {
        chatType: number;
        groupCode?: number;
        toUin?: number;
        toUid?: string;
        elems: InferProtoModelInput<typeof Msg.Elem>[];
        random?: number;
        content?: Buffer;
    }): Promise<{
        resultCode: number;
        errMsg: string;
        sequence: number;
        timestamp: number | undefined;
        random: number;
        clientSequence: number;
    }>;
    sendC2CFileMessage(opts: {
        toUin: number;
        toUid: string;
        fileUuid: string;
        fileName: string;
        fileSize: number;
        file10MMd5: Buffer;
        crcMedia: string;
    }): Promise<{
        resultCode: number;
        errMsg: string | undefined;
        sequence: number | undefined;
        timestamp: number | undefined;
        random: number;
        clientSequence: number;
        expireTime: number;
    }>;
    fetchMsgEmojiLikes(groupCode: number, msgSeq: number, emojiCode: string, count: number, cookie: string): Promise<{
        readonly users: {
            uin: number;
        }[];
        readonly cookie: string;
        readonly isLastPage: boolean;
        readonly isFirstPage: boolean;
    }>;
    reportMessageRead(chatType: number, peerUid: string, startSequence: number): Promise<{
        readonly retCode: number;
        readonly retMsg: string;
    }>;
    setInputStatus(toUid: string, eventType: number): Promise<{
        readonly body: {
            retCode: number;
        };
    }>;
}

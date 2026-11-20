import { GroupMsgMask, MessageElement, Peer, RawMessage, SendMessageElement } from '../types';
import { Context, Service } from 'cordis';
import { Msg } from '../proto';
import { InferProtoModelInput } from '@saltify/typeproto';
declare module 'cordis' {
    interface Context {
        ntMsgApi: NTMsgApi;
    }
}
export declare class NTMsgApi extends Service {
    protected ctx: Context;
    static inject: string[];
    constructor(ctx: Context);
    setGroupMsgReaction(groupCode: number, msgSeq: number, emojiId: string, setEmoji: boolean, emojiType?: number): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    getMsgReactionList(peer: Peer, msgSeq: number, emojiId: string, count: number, cookie: string): Promise<{
        readonly users: {
            uin: number;
        }[];
        readonly cookie: string;
        readonly isLastPage: boolean;
        readonly isFirstPage: boolean;
    }>;
    recallMsg(peer: Peer, msgSeq: number, clientSeq?: number, msgRandom?: number, msgTime?: number): Promise<void>;
    /** 按 (peerUid, msgRandom) 匹配: random 是两端唯一可靠对得上的字段, msgSeq 偶尔会差几个 */
    private waitForSelfEcho;
    sendMsg(peer: Peer, msgElements: SendMessageElement[], groupMsgMask?: GroupMsgMask): Promise<RawMessage>;
    private rawPbHex;
    getSingleMsg(peer: Peer, msgSeq: number): Promise<{
        retcode: number;
        errorMsg: string | undefined;
        msgList: RawMessage[];
    }>;
    /** 一次最多拉取 30 条消息 */
    getMsgsBySeqAndCount(peer: Peer, msgSeq: number, cnt: number, queryOrder: boolean): Promise<{
        retcode: number;
        errorMsg: string | undefined;
        msgList: RawMessage[];
    }>;
    getC2CMsgsByTimeAndCount(peer: Peer, msgTime: number, cnt: number, queryOrder: boolean): Promise<{
        msgList: RawMessage[];
    }>;
    setMsgRead(peer: Peer, startSeq: number): Promise<{
        readonly retCode: number;
        readonly retMsg: string;
    }>;
    getCustomFaceList(): Promise<{
        retCode: number;
        errMsg: string;
        emojiInfoList: {
            emojiId: string;
            url: string;
        }[];
    }>;
    addCustomFace(emojiPath: string): Promise<{
        retCode: number;
        errMsg: string;
        emojiId: string;
    }>;
    deleteCustomFace(emojiIds: string[]): Promise<{
        readonly retCode: number;
        readonly errMsg: string;
        readonly subCmd: number;
        readonly results: {
            emojiId: string;
            status: number;
        }[];
    }>;
    translatePtt2Text(msgId: string, peer: Peer, senderUin: number, voiceMsgElement: MessageElement): Promise<string>;
    setPrivateInputStatus(toUid: string, eventType: number): Promise<{
        retCode: number;
    }>;
    getPins(): Promise<{
        readonly friends: {
            uid: string;
        }[];
        readonly groups: {
            groupCode: number;
        }[];
    }>;
    sendPrivateFileMessage(opts: {
        toUin: number;
        toUid: string;
        fileUuid: string;
        fileName: string;
        fileSize: number;
        file10MMd5: Buffer;
        crcMedia: string;
    }): Promise<{
        message: undefined;
        resultCode: number;
        errMsg: string | undefined;
        sequence: number | undefined;
        timestamp: number | undefined;
        random: number;
        clientSequence: number;
        expireTime: number;
    } | {
        message: RawMessage;
        resultCode: number;
        errMsg: string | undefined;
        sequence: number | undefined;
        timestamp: number | undefined;
        random: number;
        clientSequence: number;
        expireTime: number;
    }>;
    sendGroupFileMessage(groupCode: number, fileId: string, busId: number): Promise<{
        retCode: number;
        feedsResultList: {
            retCode: number;
            detail: string;
            fileId: string;
            busId: number;
            deadTime: number;
            msgSeq: number;
        }[];
        retMsg: string;
        clientWording: string;
        svrBusyWaitTime: number;
    }>;
    getLatestMsgSeq(peer: Peer): Promise<number>;
    getForwardedMsgs(resId: string): Promise<{
        msgList: RawMessage[];
    }>;
    uploadForwardMsgs(peerUid: string, isGroup: boolean, items: InferProtoModelInput<typeof Msg.PbMultiMsgItem>[]): Promise<string>;
    getRecommendFace(word: string): Promise<{
        readonly info: {
            url: string;
        }[];
    }>;
}

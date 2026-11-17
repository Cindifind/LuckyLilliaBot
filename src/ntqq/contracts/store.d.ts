import { ChatType, Peer, RawMessage } from './ntqqapi/types';
import { FileCache } from './support/types';
import { Context, Service } from 'cordis';
import { noop } from 'cosmokit';
declare module 'cordis' {
    interface Context {
        store: Store;
    }
}
declare module '@cordisjs/plugin-database' {
    interface Tables {
        message: {
            shortId: number;
            msgId: string;
            chatType: number;
            peerUid: string;
            msgSeq: number;
        };
        file: FileCache;
        group_member: {
            groupCode: number;
            uin: number;
            cardName: string;
        };
        uix: {
            uid: string;
            uin: number;
        };
        temp_chat_info: {
            peerUid: string;
            groupCode: number;
        };
    }
}
export interface MsgInfo {
    msgId: string;
    msgSeq: number;
    peer: Peer;
}
declare class Store extends Service {
    protected ctx: Context;
    config: Store.Config;
    static inject: string[];
    private readonly selfUid;
    private ids;
    private messages;
    private msgTimestamps;
    private sweepTimer?;
    constructor(ctx: Context, config: Store.Config);
    [Service.init](): Promise<typeof noop>;
    start(): void;
    private initDatabase;
    /**
     * 同一条消息在不同时机 / 视角必须算出同一个 key。群: groupCode + msgSeq + msgRandom 所有人一致, msgId 在推送和
     * 拉历史时不一样, 不能用。C2C: 双端的 peerUid 不同, 本端发送时也未必有 c2cMsgSeq, 所以只用排好序的
     * (selfUid, otherUid) + msgRandom
     */
    private buildShortIdKey;
    createMsgShortId(meta: {
        msgId: string;
        msgSeq: number;
        msgRandom: number;
        peerUid: string;
        senderUid: string;
        chatType: ChatType;
    }): number;
    getMsgInfoByShortId(shortId: number): Promise<MsgInfo | undefined>;
    getMsgBySeq(peerUid: string, msgSeq: number): RawMessage | undefined;
    /** C2C 撤回推送里的 seq 不可靠, random 是双端唯一对得上的字段 */
    getMsgByRandom(peerUid: string, msgRandom: number): RawMessage | undefined;
    getMsgByMsgId(msgId: string): RawMessage | undefined;
    addFileCache(data: FileCache): Promise<void>;
    getFileCacheByName(fileName: string): Promise<import("@cordisjs/plugin-database").FlatPick<FileCache, any>[]>;
    getFileCacheById(fileUuid: string): Promise<FileCache[]>;
    addMsgCache(msg: RawMessage): Promise<void>;
    private sweepExpired;
    getGroupMemberCardName(groupCode: number, uin: number): Promise<string | undefined>;
    setGroupMemberCardName(groupCode: number, uin: number, cardName: string): Promise<import("@cordisjs/plugin-database").Driver.WriteResult>;
    addUix(uix: {
        uid: string;
        uin: number;
    }[]): Promise<import("@cordisjs/plugin-database").Driver.WriteResult>;
    getUinByUid(uid: string): Promise<number | undefined>;
    getUidByUin(uin: number): Promise<string | undefined>;
    addTempChatInfo(info: {
        peerUid: string;
        groupCode: number;
    }): Promise<import("@cordisjs/plugin-database").Driver.WriteResult>;
    getTempChatInfo(peerUid: string): Promise<{
        peerUid: string;
        groupCode: number;
    } | undefined>;
}
declare namespace Store {
    interface Config {
        /** 单位为秒 */
        msgCacheExpire: number;
    }
}
export default Store;

import type { QQProtocolBase } from '../base';
export declare function FriendMixin<T extends abstract new (...args: any[]) => QQProtocolBase>(Base: T): T & (abstract new (...args: any[]) => FriendMixinMethods);
/** Public methods contributed by this protocol mixin. */
export interface FriendMixinMethods {
    sendFriendPoke(friendUin: number, toUin: number): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    getPrivateFileUrl(receiverUid: string, fileUuid: string): Promise<{
        readonly command: number;
        readonly subCommand: number;
        readonly body: {
            retCode: bigint;
            state: string;
            result: {
                extra: {
                    field100: number;
                    download: {
                        downloadUrl: Buffer<ArrayBufferLike>;
                        downloadDns: string;
                    };
                };
            };
            metadata: {
                fileName: string;
            };
        };
        readonly field50: number;
    }>;
    setFriendRequest(targetUid: string, accept: number): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    setFilteredFriendRequestReq(selfUid: string, requestUid: string): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    fetchFriends(cookie?: Buffer): Promise<{
        readonly seq: number;
        readonly cookie: Buffer<ArrayBufferLike> | undefined;
        readonly isEnd: boolean;
        readonly time: number;
        readonly selfUin: number;
        readonly smallSeq: number;
        readonly friendList: {
            uid: string;
            categoryId: number;
            uin: number;
            subBiz: Map<number, {
                numData: Map<number, number>;
                data: Map<number, Buffer<ArrayBufferLike>>;
            }>;
        }[];
        readonly category: {
            categoryId: number;
            categoryName: string;
            categoryMemberCount: number;
            categorySortId: number;
        }[];
    }>;
    getFriendRecommendContactArk(uin: number): Promise<{
        readonly ark: string;
    }>;
    setFriendRemark(uid: string, remark: string): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    deleteFriend(targetUid: string, block: boolean, bothDelete: boolean): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    setFriendCategory(uid: string, categoryId: number): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    fetchFriendRequests(selfUid: string, reqNum: number): Promise<{
        readonly field1: number;
        readonly field2: number;
        readonly info: {
            field2: number;
            count: number;
            requests: {
                selfUid: string;
                friendUid: string;
                state: number;
                timestamp: number;
                comment: string;
                source: string;
                sourceId: number;
                subSourceId: number;
                isInitiator: boolean;
            }[];
        };
    }>;
    fetchFilteredFriendRequests(count: number): Promise<{
        readonly info: {
            requests: {
                sourceUid: string;
                sourceNickname: string;
                comment: string;
                source: string;
                warningInfo: string;
                timestamp: number;
                groupCode: number;
            }[];
        };
    }>;
    setFriendPin(friendUid: string, isPinned: boolean): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    getFriendLatestSequence(peerUid: string): Promise<{
        readonly retCode: number;
        readonly retMsg: string;
        readonly seq1: number;
        readonly seq2: number;
        readonly latestMsgTime: number;
    }>;
    getFriendsStatus(selfUid: string): Promise<{
        readonly list: {
            uid: string;
            status: number;
        }[];
    }>;
}

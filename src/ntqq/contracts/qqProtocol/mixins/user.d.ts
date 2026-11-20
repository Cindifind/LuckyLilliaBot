import type { QQProtocolBase } from '../base';
export declare function UserMixin<T extends abstract new (...args: any[]) => QQProtocolBase>(Base: T): T & (abstract new (...args: any[]) => UserMixinMethods);
/** Public methods contributed by this protocol mixin. */
export interface UserMixinMethods {
    fetchUserInfoByUin(uin: number): Promise<{
        readonly body: {
            properties: {
                numberProperties: Map<number, number>;
                bytesProperties: Map<number, Buffer<ArrayBufferLike>>;
            };
            uin: number;
        };
    }>;
    fetchUserInfoByUid(uid: string): Promise<{
        readonly body: {
            properties: {
                numberProperties: Map<number, number>;
                bytesProperties: Map<number, Buffer<ArrayBufferLike>>;
            };
            uin: number;
        };
    }>;
    fetchUserLoginDays(uin: number): Promise<number>;
    sendFriendLike(targetUid: string, count?: number): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    setOnlineStatus(status: number, extStatus: number, batteryStatus: number, customFaceId?: number, customText?: string): Promise<{
        readonly retCode: number;
        readonly message: string;
    }>;
    fetchClientKey(): Promise<{
        readonly psKeys: Map<string, string>;
        readonly keyType: number;
        readonly clientKey: string;
        readonly expiration: number;
    }>;
    fetchPSkey(domains: string[]): Promise<{
        readonly psKeys: Map<string, string>;
        readonly keyType: number;
        readonly clientKey: string;
        readonly expiration: number;
    }>;
    fetchProfileLikes(selfUid: string, direction: 0 | 1, start: bigint, count: number): Promise<{
        readonly userLikeInfo: {
            targetUid: string;
            field2: number;
            favoriteInfo: {
                users: {
                    uid: string;
                    src: number;
                    latestTime: number;
                    count: number;
                    giftCount: number;
                    customId: number;
                    lastCharged: number;
                    bTodayVotedCnt: number;
                    nick: string;
                    gender: number;
                    age: number;
                    isvip: boolean;
                    isSvip: boolean;
                }[];
            };
            voteInfo: {
                totalCount: number;
                users: {
                    uid: string;
                    src: number;
                    latestTime: number;
                    count: number;
                    giftCount: number;
                    customId: number;
                    lastCharged: number;
                    bTodayVotedCnt: number;
                    nick: string;
                    gender: number;
                    age: number;
                    isvip: boolean;
                    isSvip: boolean;
                }[];
            };
        };
        readonly start: number;
    }>;
    fetchProfileLikeCount(uid: string): Promise<{
        readonly body: {
            voteInfo: {
                totalCount: number;
            };
        };
    }>;
    modifySelfProfile(profile: {
        nick?: string;
        longNick?: string;
        sex?: number;
        birthdayYear?: number;
        birthdayMonth?: number;
        birthdayDay?: number;
    }): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
}

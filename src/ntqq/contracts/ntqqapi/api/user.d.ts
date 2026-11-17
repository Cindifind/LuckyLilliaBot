import { User } from '../types';
import { Context, Service } from 'cordis';
declare module 'cordis' {
    interface Context {
        ntUserApi: NTUserApi;
    }
}
export declare class NTUserApi extends Service {
    protected ctx: Context;
    static inject: string[];
    constructor(ctx: Context);
    setSelfAvatar(filePath: string): Promise<{
        result: number;
        errMsg: string;
    }>;
    getUidByUin(uin: number, groupCode?: number): Promise<string>;
    getUinByUid(uid: string): Promise<number>;
    getUserByUin(uin: number): Promise<User>;
    getUserByUid(uid: string): Promise<User>;
    getPSkey(domains: string[]): Promise<Map<string, string>>;
    getClientKey(): Promise<{
        clientKey: string;
        expiration: number;
    }>;
    getSelfNick(refresh?: boolean): Promise<string>;
    setSelfStatus(status: number, extStatus: number, batteryStatus: number): Promise<{
        readonly retCode: number;
        readonly message: string;
    }>;
    sendProfileLike(uid: string, count?: number): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    getProfileLike(uid: string, start: number, limit: number): Promise<{
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
    getProfileLikeMe(uid: string, start: number, limit: number): Promise<{
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
    getProfileLikeCount(uid: string): Promise<{
        readonly body: {
            voteInfo: {
                totalCount: number;
            };
        };
    }>;
    modifySelfProfile(profile: {
        nick?: string;
        bio?: string;
        gender?: number;
        birthdayYear?: number;
        birthdayMonth?: number;
        birthdayDay?: number;
    }): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
}

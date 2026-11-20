import { FriendCategory, Friend } from '../types';
import { Context, Service } from 'cordis';
declare module 'cordis' {
    interface Context {
        ntFriendApi: NTFriendApi;
    }
}
export declare class NTFriendApi extends Service {
    protected ctx: Context;
    static inject: string[];
    private friendsCache;
    private categoriesCache;
    private refreshingFriends?;
    constructor(ctx: Context);
    getFriends(forceUpdate: boolean): Promise<{
        friends: Friend[];
        categories: Map<number, FriendCategory>;
    }>;
    getFriendByUin(uin: number, forceUpdate: boolean): Promise<Friend | undefined>;
    getFriendByUid(uid: string, forceUpdate: boolean): Promise<Friend | undefined>;
    isFriend(uid: string): Promise<boolean>;
    getFriendRecommendContactArk(uin: number): Promise<string>;
    setFriendRemark(uid: string, remark?: string): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    deleteFriend(targetUid: string, block?: boolean, bothDelete?: boolean): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    setFriendCategory(uid: string, categoryId: number): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    getFriendRequests(limit: number): Promise<{
        selfUid: string;
        friendUid: string;
        state: number;
        timestamp: number;
        comment: string;
        source: string;
        sourceId: number;
        subSourceId: number;
        isInitiator: boolean;
    }[]>;
    getDoubtFriendRequests(limit: number): Promise<{
        sourceUid: string;
        sourceNickname: string;
        comment: string;
        source: string;
        warningInfo: string;
        timestamp: number;
        groupCode: number;
    }[]>;
    approvalFriendRequest(friendUid: string, accept: boolean): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    approvalDoubtFriendRequest(requestUid: string): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    setFriendPin(friendUid: string, isPinned: boolean): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    sendFriendNudge(friendUin: number, isSelf: boolean): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    getFriendsStatus(): Promise<{
        uid: string;
        status: number;
    }[]>;
}

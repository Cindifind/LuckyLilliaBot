import { Context } from 'cordis';
interface ServerRkeyData {
    group_rkey: string;
    private_rkey: string;
    expired_time: number;
}
export declare class RkeyManager {
    protected ctx: Context;
    private serverUrl;
    private rkeyData;
    private pull?;
    constructor(ctx: Context, serverUrl: string);
    getRkey(refresh?: boolean): Promise<ServerRkeyData>;
    isExpired(): boolean;
    refreshRkey(): Promise<void>;
    fetchServerRkey(): Promise<ServerRkeyData>;
}
export {};

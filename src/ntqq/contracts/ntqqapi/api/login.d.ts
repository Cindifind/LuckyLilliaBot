import { Context, Service } from 'cordis';
declare module 'cordis' {
    interface Context {
        ntLoginApi: NTLoginApi;
    }
}
export declare class NTLoginApi extends Service {
    protected ctx: Context;
    static inject: string[];
    constructor(ctx: Context);
    getQuickLoginList(): Promise<{
        ready: boolean;
        LocalLoginInfoList: {
            uin: string;
            uid: string;
            nickName: string;
            faceUrl: string;
            loginType: number;
            isQuickLogin: boolean;
            isAutoLogin: boolean;
            isUserLogin: boolean;
        }[];
    }>;
    getLoginQrCode(): Promise<{
        qrcodeUrl: string;
        pngBase64QrcodeData: string;
        expireTime: number;
        pollTimeInterval: number;
    }>;
}

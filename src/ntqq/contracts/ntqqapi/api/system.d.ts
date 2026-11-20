import { Context, Service } from 'cordis';
declare module 'cordis' {
    interface Context {
        ntSystemApi: NTSystemApi;
    }
}
export declare class NTSystemApi extends Service {
    protected ctx: Context;
    static inject: string[];
    constructor(ctx: Context);
    restart(): Promise<void>;
    getSettingAutoLogin(): Promise<boolean>;
    setSettingAutoLogin(_state: boolean): Promise<void>;
    getDeviceInfo(): Promise<{
        devType: string;
        buildVer: string;
    }>;
}

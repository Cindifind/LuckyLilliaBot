export interface PBData {
    echo?: string;
    cmd: string;
    pb: string;
}
export interface NativeQQResSendPB {
    type: 'send' | 'recv';
    data: PBData;
    code?: number;
    message?: string;
}
export interface NativeQQResRecvPB {
    type: 'recv';
    data: PBData;
    code?: number;
    message?: string;
}
export interface NativeQQReqSendPB {
    type: 'send';
    data: PBData;
}
export type NativeQQRes = NativeQQResSendPB | NativeQQResRecvPB;
export type NativeQQReq = NativeQQReqSendPB;
export interface ResListener<R extends NativeQQRes> {
    (data: R): void;
}
/** 只列用到的字段 */
export interface NativeQQHealth {
    /** The native session's phase: stopped / starting / running / stopping / failed */
    sessionStatus?: string;
    failure?: string | null;
    auth_token_set?: boolean;
    /** QQ's process, once it is up */
    qq_pid?: number | null;
    qrcode_available?: boolean;
    uin?: number | null;
    uid?: string | null;
    qq_full_version?: string;
    memory?: {
        qq_using: number;
        free: number;
        total: number;
    };
    cpu?: {
        qq_using: number;
        free: number;
        total: number;
    };
}
/** 字节 + 百分数 */
export interface QQResourceUsage {
    memory: number;
    totalMemory: number;
    memoryPercent: number;
    cpu: number;
    version?: string;
}
/** The bridge as the NTQQ page shows it, read from NativeQQ.health() */
export interface BridgeStatus {
    /** stopped / starting / running / stopping / failed */
    session: string;
    failure?: string;
    authTokenSet: boolean;
    /** QQ's process is up */
    qqRunning: boolean;
    /** health() has both the uin and the uid */
    loggedIn: boolean;
    qrcodeAvailable: boolean;
}

import type { PBData, QQResourceUsage, BridgeStatus } from './types';
import type { SelfInfo } from '../ntqqapi/types';
import type { AuthTokenStatus } from './direct-lib/authTokenWatcher';
import { Context, Service } from 'cordis';
type DisconnectCallback = (duration: number) => void;
type LoginQrCode = {
    qrcodeUrl: string;
    pngBase64QrcodeData: string;
    expireTime: number;
    pollTimeInterval: number;
};
declare module 'cordis' {
    interface Events {
        /** uid / uin 都已就绪 */
        'qq/online': () => void;
        /** The login identity was explicitly cleared; transient network disconnects do not emit this. */
        'qq/logout': () => void;
        /** 重连后会再次 emit `qq/online` */
        'protocol/disconnect': () => void;
        /** An online QQ session was rejected; notify consumers without applying KickNT recovery. */
        'qq/session-expired': (reason: string) => void;
        'llbot/self-nick-changed': (info: {
            nick: string;
        }) => void;
    }
}
/** NativeQQ (桥接官方 QQ 客户端) 与 Direct (native sign + TCP) 共用的基类 */
export interface QuickLoginAccount {
    uin: string;
    uid: string;
    nick: string;
    faceUrl?: string;
}
export interface QuickLoginAccounts {
    ready: boolean;
    accounts: QuickLoginAccount[];
}
/** The installed protocol implementation cannot offer saved-account login. */
export declare class QuickLoginUnsupportedError extends Error {
}
export declare abstract class QQProtocolBase extends Service {
    protected ctx: Context;
    protected readonly loginOptions: {
        autoLoginUin?: string;
    };
    static inject: string[];
    private disconnectCallbacks;
    protected lastConnectedTime: number;
    private disconnectCheckTimer;
    protected logger: import("cordis").Logger;
    /** Protocol-owned login identity. General-purpose plugins use session.bot or ctx.bots. */
    readonly selfInfo: SelfInfo;
    /** How logging in with the auth token goes. Each protocol instance owns its authorization state. */
    readonly authTokenStatus: AuthTokenStatus;
    protected onlineEmitted: boolean;
    protected disposed: boolean;
    protected qrResult: {
        qrcodeUrl: string;
        pngBase64: string;
        expireTimeSec: number;
        sig: string;
    } | null;
    protected qrFetchedAt: number;
    protected lastPrintedQrSig: string;
    private qrLoopRunning;
    private qrAutoRefreshCount;
    private qrAutoRefreshStopLogged;
    private qrRefreshInflight;
    private qrFetchFailures;
    private qrFetchRetryAt;
    private static readonly QR_FETCH_RETRY_MS;
    private static readonly QR_FETCH_RETRY_MAX_MS;
    constructor(ctx: Context, loginOptions?: {
        autoLoginUin?: string;
    });
    abstract sendPB(cmd: string, pb: Buffer | string, timeout?: number): Promise<PBData>;
    abstract get_is_connected(): boolean;
    /** expireTimeSec 当 TTL 用, sig 用于终端打印去重。null = 暂不可用 (QQ 未起 / 已登录), loop 静默重试 */
    protected abstract fetchFreshQrCode(): Promise<{
        qrcodeUrl: string;
        pngBase64: string;
        expireTimeSec: number;
        sig: string;
    } | null>;
    /**
     * The accounts that log in without a QR code: Direct's saved sessions, the bridge's from the injected QQ.
     * `ready: false` while the bridge's QQ is not far enough along to say: ask again.
     */
    listQuickLoginAccounts(): Promise<QuickLoginAccounts>;
    /** Only the bridge has something to start: QQ, from the NTQQ page's button */
    launch(): Promise<void>;
    /** The bridge's session as NativeQQ reports it; undefined for the pure protocol */
    bridgeStatus(): Promise<BridgeStatus | undefined>;
    /** Resolves only once the selected account is online; errors let the WebUI offer QR login. */
    quickLogin(_uin: string): Promise<void>;
    /** 仅 Direct 实现 */
    logout(): Promise<void>;
    protected clearLogin(): Promise<void>;
    /** WebUI 存了新的 auth token, 立刻校验, 不等下一轮查文件 */
    checkAuthToken(): void;
    /** 只有 NativeQQ 有 QQ 进程可量; null 时 WebUI 不显示 QQ 资源卡 */
    getQQResourceUsage(): Promise<QQResourceUsage | null>;
    protected abstract start(): Promise<void>;
    [Service.init](): Promise<() => Promise<void>>;
    /**
     * Switching the protocol plugin off. Unlike a disconnect it emits nothing: consumers are going away with it,
     * and the email notification must not report a loss the user asked for.
     */
    protected stop(): Promise<void>;
    sendOidb(command: number, subCommand: number, body: Buffer, cmdSuffix?: string): Promise<{
        errorCode: number;
        errorMsg: string;
    }>;
    protected maybeEmitOnline(): void;
    /** ntUserApi 在 qq/online 之后才加载, 所以等它。guardCheck 防止会话已换代 (重复登录 / 换号) 时写回 */
    protected scheduleFetchSelfNick(guardCheck?: () => boolean): void;
    /**
     * 返回缓存的那张 (过期才拉新), 终端 / WebUI 显示的是同一张码。expireTime 是剩余秒数。
     * 调用方是 WebUI 上的用户, 算手动刷新, 不受自动刷新上限限制
     */
    getLoginQrCode(): Promise<LoginQrCode>;
    /** null: 拉码被跳过 (退避 / 上限 / 登录收尾) 或 client 未就绪。拉码本身报错才抛 */
    private peekLoginQrCode;
    /**
     * - Loop-driven fetches stop at qrAutoRefreshLimit() and wait out the failure backoff; a manual refresh
     *   skips both and resets the count.
     * - No fetch while a login is completing (shouldSkipQrPrint): that code would go to waste.
     * - Concurrent callers share one fetch: a second one would cancel the poll of the code the WebUI shows.
     */
    protected refreshQrCodeIfStale(manual?: boolean): Promise<void>;
    private fetchQrIntoCache;
    /** The last fetch failed and nothing fresh is cached: skip ticks until the backoff runs out. */
    private qrFetchBackingOff;
    private isQrFresh;
    /**
     * Cap on loop-driven QR fetches (first code included) before the loop stops refreshing and waits
     * for a manual refresh. Unlimited by default: NativeQQ only reads the codes QQ itself refreshes.
     */
    protected qrAutoRefreshLimit(): number;
    /** Cap reached and the cached code has lapsed: nothing to show until a manual refresh or a login. */
    private qrAutoRefreshExhausted;
    protected invalidateQrCache(): void;
    /** 连打印去重的 sig 一起清, 重连后会重新打印 */
    protected resetQrState(): void;
    /** Direct 在这里启动扫码 poll; NativeQQ 靠 health() 探测 online */
    protected onQrRefreshed(): void;
    /** 同时落盘 png。同一张码只打印一次 */
    protected printQrToTerminal(): Promise<void>;
    protected ensureQrLoop(): void;
    /** 只暂停拉码, 不停 loop: register 失败清掉 session 后还得接着出码 */
    protected shouldSkipQrPrint(): boolean;
    /** 每秒一 tick, 拉码节流靠 refreshQrCodeIfStale 的 TTL */
    private qrLoop;
    onDisconnect(timeout: number, callback: DisconnectCallback): string;
    offDisconnect(id: string): void;
    protected startDisconnectMonitoring(): void;
}
export {};

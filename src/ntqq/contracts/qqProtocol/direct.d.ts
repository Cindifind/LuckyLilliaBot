import type { PBData } from './types';
import { QQProtocolBase, type QuickLoginAccounts } from './base';
/** 持有的 DirectProtocolClient (direct-lib/client.ts) 是底层连接, 别跟本类混淆 */
export declare class DirectQQProtocol extends QQProtocolBase {
    private directClient;
    private directInitInFlight;
    private directPendingToken;
    private directQrResult;
    private directPollResult;
    private directStopHeartbeat;
    private readonly tokenWatcher;
    private clientListeners;
    private reconnectTimer;
    private manualLogout;
    private qrPollToken;
    private initToken;
    private static readonly QR_TTL_MS;
    private static readonly QR_AUTO_REFRESH_LIMIT;
    private static readonly RECONNECT_MS;
    private static readonly RECONNECT_MAX_MS;
    private static readonly QUICK_LOGIN_WAIT_MS;
    private runtimeUinOverride;
    private restoreError;
    protected start(): Promise<void>;
    /** Disconnects but keeps the saved session, so switching the plugin back on logs in without a QR code. */
    protected stop(): Promise<void>;
    /** session-expired 会 clearSession, 所以 isLoggedIn 能反映凭据作废; 再加上 TCP 状态 */
    get_is_connected(): boolean;
    sendPB(cmd: string, pb: Buffer | string, timeout?: number): Promise<PBData>;
    listQuickLoginAccounts(): Promise<QuickLoginAccounts>;
    /**
     * 相当于带 -q <uin> 启动, 等到有结果才返回: 上线了就成功, 没上线就抛出原因, FE 显示后退回扫码。
     * init 自己失败时只会悄悄退回扫码, 不等结果的话 WebUI 只能干等
     */
    quickLogin(uin: string): Promise<void>;
    logout(): Promise<void>;
    protected fetchFreshQrCode(): Promise<{
        qrcodeUrl: string;
        pngBase64: string;
        expireTimeSec: number;
        sig: string;
    } | null>;
    protected onQrRefreshed(): void;
    checkAuthToken(): void;
    /** 登录错误写进 authTokenStatus.loginError 给 WebUI; init 抛错交给 watcher 定时重试 */
    private onAuthTokenValid;
    protected shouldSkipQrPrint(): boolean;
    protected qrAutoRefreshLimit(): number;
    /**
     * Only a failed init is retried, with backoff. Once init returns the QR loop takes over: rescheduling after a
     * QR fallback would replace the code every 5s.
     */
    private scheduleReconnect;
    /** 没有 auth_token 时直接返回而不是 throw, 进程和 WebUI 照常起来 */
    private initDirectClient;
    private doInitDirectClient;
    /** 每个实例接上 client 时调一次 */
    private bindDirectClientEvents;
    private startDirectQrPolling;
    private completeDirectLogin;
}

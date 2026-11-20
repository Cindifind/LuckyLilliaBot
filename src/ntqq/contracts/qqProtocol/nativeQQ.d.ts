import type { BridgeStatus, NativeQQRes, PBData, QQResourceUsage, ResListener } from './types';
import { QQProtocolBase, type QuickLoginAccounts } from './base';
/**
 * The protocol owns one NativeQQ, its sessions (one at a time, started by launch()), each session's token watcher
 * and polling timer. What the bridge is doing is NativeQQ's to say: health() has the session's phase, QQ's process
 * and the account.
 */
export declare class NativeQQProtocol extends QQProtocolBase {
    private native?;
    private config;
    private configuredToken;
    private launching?;
    private watcher?;
    private probeTimer?;
    private connected;
    private generation;
    private quickLoginPending?;
    private resListeners;
    protected start(): Promise<void>;
    private nativeConfig;
    /**
     * Starts a native session, which starts QQ and injects it: the NTQQ page's button, or start() where nobody would
     * press it. Again after a session stopped or failed; a second call while one starts waits for it.
     */
    launch(): Promise<void>;
    /**
     * The QQ a session would start, picked as NativeQQ picks it (a relative qq_path is from its own directory), so
     * that a missing one fails with what to do in the WebUI rather than NativeQQ's "set config.qq_path".
     */
    private qqToStart;
    private startSession;
    /** What a session leaves behind once it stopped or failed: its token watcher and its poll */
    private endSession;
    bridgeStatus(): Promise<BridgeStatus>;
    protected stop(): Promise<void>;
    checkAuthToken(): void;
    /** The saved accounts the injected QQ can log in now, once its login service is ready. */
    listQuickLoginAccounts(): Promise<QuickLoginAccounts>;
    quickLogin(uin: string): Promise<void>;
    private loginAccount;
    get_is_connected(): boolean;
    private onNativeEvent;
    private disconnect;
    private sessionEnded;
    private probe;
    sendPB(cmd: string, pb: Buffer | string, timeout?: number): Promise<PBData>;
    protected fetchFreshQrCode(): Promise<{
        qrcodeUrl: any;
        pngBase64: any;
        expireTimeSec: any;
        sig: any;
    } | null>;
    getQQResourceUsage(): Promise<QQResourceUsage | null>;
    addResListener<R extends NativeQQRes>(listener: ResListener<R>): string;
    removeResListener(id: string): void;
    waitConnected(): Promise<boolean>;
}
